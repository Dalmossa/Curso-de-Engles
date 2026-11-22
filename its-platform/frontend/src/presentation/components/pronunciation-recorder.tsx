'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import type { PronunciationEvaluation } from '@/core';
import type { ActionResult } from '@/shared/action-result';
import { copy } from '@/presentation/lib/copy';

interface PronunciationRecorderProps {
  /** The target phrase the learner should pronounce. */
  targetText: string;
  /**
   * Server Action to evaluate pronunciation.
   *
   * The shape is the project's `ActionResult`: a success carries the evaluation, a
   * failure carries the serialised `DomainError` — which carries the HTTP status the
   * platform answered with, and that is what tells "there is no ASR service" apart from
   * "the platform failed".
   */
  evaluateAction: (input: {
    expectedText: string;
    transcript?: string;
    audioBase64?: string;
    mimeType?: string;
    locale?: string;
  }) => Promise<ActionResult<PronunciationEvaluation>>;
  /** Called when evaluation completes successfully. */
  onEvaluate?: (evaluation: PronunciationEvaluation) => void;
  /** Maximum recording duration in seconds. */
  maxDurationSeconds?: number;
}

const AUDIO_BITS_PER_SECOND = 24_000; // ~24 kbps to stay under 100KB JSON limit

type RecordingState = 'idle' | 'recording' | 'processing' | 'result' | 'error';

export function PronunciationRecorder({
  targetText,
  evaluateAction,
  onEvaluate,
  maxDurationSeconds = 15,
}: PronunciationRecorderProps) {
  const [state, setState] = useState<RecordingState>('idle');
  const [recordingTimeMs, setRecordingTimeMs] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState('');
  const [evaluation, setEvaluation] = useState<PronunciationEvaluation | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Hydration-safe: same initial markup on server/client; capabilities detected after mount.
  const [canRecord, setCanRecord] = useState(false);
  const [hasSpeechRecognition, setHasSpeechRecognition] = useState(false);
  const [micBlockReason, setMicBlockReason] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recognitionRef = useRef<unknown>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const speechRecognitionSupported =
      'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    const mediaDevicesSupported =
      typeof navigator !== 'undefined' &&
      typeof navigator.mediaDevices?.getUserMedia === 'function';
    const secure = window.isSecureContext;
    // Post-mount only: keeps server/client initial markup identical for hydration.
    // Recording requires secure context + MediaRecorder/getUserMedia; SpeechRecognition is optional transcript only.
    /* eslint-disable react-hooks/set-state-in-effect -- intentional mount-time capability detection */
    setHasSpeechRecognition(speechRecognitionSupported);
    if (!secure) {
      setCanRecord(false);
      setMicBlockReason(copy.pronunciation.micInsecureContext);
    } else if (!mediaDevicesSupported) {
      setCanRecord(false);
      setMicBlockReason(copy.pronunciation.micError);
    } else {
      setCanRecord(true);
      setMicBlockReason(null);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const handleEvaluate = useCallback(async () => {
    if (!audioBlob && !transcript.trim()) {
      setError(copy.pronunciation.noRecording);
      return;
    }

    setState('processing');
    setError(null);

    let audioBase64: string | undefined;
    let mimeType: string | undefined;

    if (audioBlob) {
      // Convert blob to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      let binary = '';
      const chunkSize = 8192;
      for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(...bytes.slice(i, i + chunkSize));
      }
      audioBase64 = btoa(binary);
      mimeType = audioBlob.type || 'audio/webm';
    }

    try {
      const result = await evaluateAction({
        expectedText: targetText,
        transcript: transcript.trim() || undefined,
        audioBase64,
        mimeType,
        locale: 'en-US',
      });

      if (result.ok) {
        setEvaluation(result.data);
        setState('result');
        onEvaluate?.(result.data);
      } else {
        const failure = result.error;
        if (failure?.status === 422) {
          setError(copy.pronunciation.asrUnavailable);
        } else {
          setError(failure?.detail || failure?.title || copy.pronunciation.evaluationFailed);
        }
        setState('error');
      }
    } catch {
      setError(copy.pronunciation.evaluationFailed);
      setState('error');
    }
  }, [audioBlob, transcript, targetText, evaluateAction, onEvaluate]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      (recognitionRef.current as SpeechRecognitionInstance).stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    startTimeRef.current = 0;
    // Auto-evaluate after recording stops
    handleEvaluate();
  }, [handleEvaluate]);

  const updateTimer = useCallback(() => {
    if (startTimeRef.current > 0) {
      const elapsed = Date.now() - startTimeRef.current;
      setRecordingTimeMs(elapsed);
      if (elapsed >= maxDurationSeconds * 1000) {
        stopRecording();
      }
    }
  }, [maxDurationSeconds, stopRecording]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [audioUrl, stopRecording]);

  const startRecording = useCallback(async () => {
    setError(null);
    setTranscript('');
    setEvaluation(null);
    chunksRef.current = [];

    try {
      if (typeof window !== 'undefined' && !window.isSecureContext) {
        setError(copy.pronunciation.micInsecureContext);
        setState('error');
        return;
      }
      if (!navigator.mediaDevices?.getUserMedia) {
        setError(copy.pronunciation.micError);
        setState('error');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000,
        },
      });

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';

      const mediaRecorder = new MediaRecorder(stream, { mimeType, audioBitsPerSecond: AUDIO_BITS_PER_SECOND });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
      };

      // Start SpeechRecognition for live transcript
      if (hasSpeechRecognition) {
        const win = window as Window & {
          SpeechRecognition?: SpeechRecognitionStatic;
          webkitSpeechRecognition?: SpeechRecognitionStatic;
        };
        const RecognitionCtor = win.SpeechRecognition || win.webkitSpeechRecognition;
        if (!RecognitionCtor) return;
        const recognition = new RecognitionCtor();
        recognitionRef.current = recognition;
        recognition.lang = 'en-US';
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            if (result?.isFinal && result[0]?.transcript) {
              finalTranscript += result[0].transcript;
            }
          }
          if (finalTranscript) {
            setTranscript((prev) => prev + ' ' + finalTranscript);
          }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          // Ignore 'no-speech' and 'aborted' errors
          if (event.error !== 'no-speech' && event.error !== 'aborted') {
            console.warn('Speech recognition error:', event.error);
          }
        };

        recognition.start();
      }

      mediaRecorder.start(100); // Collect data every 100ms
      startTimeRef.current = Date.now();
      setState('recording');
      timerRef.current = setInterval(updateTimer, 100);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        setError(copy.pronunciation.micPermissionDenied);
      } else if (err instanceof DOMException && (err.name === 'NotFoundError' || err.name === 'NotReadableError')) {
        setError(copy.pronunciation.micError);
      } else if (err instanceof DOMException && err.name === 'SecurityError') {
        setError(copy.pronunciation.micInsecureContext);
      } else {
        setError(copy.pronunciation.micError);
      }
      setState('error');
    }
  }, [hasSpeechRecognition, updateTimer]);

  const handleRerecord = useCallback(() => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setTranscript('');
    setEvaluation(null);
    setError(null);
    setState('idle');
  }, [audioUrl]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = Math.min(recordingTimeMs / (maxDurationSeconds * 1000), 1);

  // Render word scores with color coding
  const renderWordScores = () => {
    if (!evaluation) return null;
    const tips = evaluation.contrastiveTips ?? [];

    return (
      <div className="space-y-3">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">{copy.pronunciation.wordScores}</h4>
          <div className="flex flex-wrap gap-1.5">
            {evaluation.wordScores.map((ws, index) => (
              <span
                key={index}
                className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
                  ws.status === 'correct'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : ws.status === 'needs_work'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}
                title={`${ws.word}: ${ws.status} (${Math.round(ws.confidence * 100)}%)`}
              >
                {ws.word}
              </span>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">{evaluation.feedbackPt}</p>
        </div>
        {tips.length > 0 && (
          <div className="rounded-md border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/50 dark:bg-amber-950/30">
            <h4 className="text-sm font-medium text-amber-900 dark:text-amber-100">{copy.pronunciation.contrastiveTips}</h4>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-900/90 dark:text-amber-100/90">
              {tips.map((tip, index) => (
                <li key={`${index}-${tip.slice(0, 24)}`}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Target phrase display */}
      <div className="p-3 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground mb-1">{copy.pronunciation.targetPhrase}</p>
        <p className="font-medium text-lg">{targetText}</p>
      </div>

      {/* Recording UI */}
      {state === 'idle' && (
        <div className="space-y-2">
          <button
            onClick={startRecording}
            disabled={!canRecord}
            className="btn btn-primary w-full py-3 text-lg"
          >
            {copy.pronunciation.startRecording}
          </button>
          {!canRecord && micBlockReason ? (
            <p className="text-sm text-amber-700 dark:text-amber-300" role="status">
              {micBlockReason}
            </p>
          ) : null}
        </div>
      )}

      {state === 'recording' && (
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
              <span className="text-lg font-mono text-red-600">{formatTime(recordingTimeMs)}</span>
            </div>
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 transition-all duration-100"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
          <button
            onClick={stopRecording}
            className="btn btn-destructive w-full py-2"
          >
            {copy.pronunciation.stopRecording}
          </button>
          {hasSpeechRecognition && transcript && (
            <details className="text-sm">
              <summary className="cursor-pointer text-muted-foreground">{copy.pronunciation.liveTranscript}</summary>
              <pre className="mt-1 p-2 bg-muted rounded text-left whitespace-pre-wrap">{transcript}</pre>
            </details>
          )}
        </div>
      )}

      {state === 'processing' && (
        <div className="flex flex-col items-center gap-3 py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-3 border-primary border-t-transparent" />
          <p className="text-muted-foreground">{copy.pronunciation.processing}</p>
        </div>
      )}

      {state === 'result' && audioUrl && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <audio controls src={audioUrl} className="flex-1" />
            <button
              onClick={handleRerecord}
              className="btn btn-outline"
            >
              {copy.pronunciation.rerecord}
            </button>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">{copy.pronunciation.yourTranscript}</p>
            <p className="font-medium">{evaluation?.transcript || copy.pronunciation.noTranscript}</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">
              {copy.pronunciation.overallScore}: <strong>{evaluation?.overallScore}/100</strong>
            </p>
            {renderWordScores()}
          </div>
        </div>
      )}

      {state === 'error' && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-300">{error}</p>
          <button onClick={handleRerecord} className="btn btn-sm btn-outline mt-2">
            {copy.pronunciation.tryAgain}
          </button>
        </div>
      )}
    </div>
  );
}

// Type augmentation for SpeechRecognition
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognitionStatic {
  new (): SpeechRecognitionInstance;
}

interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionStatic;
    webkitSpeechRecognition: SpeechRecognitionStatic;
  }
}