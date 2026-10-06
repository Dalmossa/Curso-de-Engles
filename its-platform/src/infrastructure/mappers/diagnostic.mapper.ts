import { DiagnosticResultEntity } from '../entities/diagnostic-result.entity.js';
import { DiagnosticResponseEntity } from '../entities/diagnostic-response.entity.js';
import {
  DiagnosticResult,
  DiagnosticResponse,
  DiagnosticRun,
} from '../../domain/entities/diagnostic-run.js';

const n = (v: string): number => Number(v);

export function diagnosticResultToDomain(e: DiagnosticResultEntity): DiagnosticResult {
  return new DiagnosticResult(
    e.id,
    e.learnerId,
    e.formVersion,
    e.createdAt,
    n(e.theta),
    n(e.seStatistical),
    n(e.seParameter),
    n(e.seEffective),
    e.precisionLabel as DiagnosticResult['precisionLabel'],
    n(e.ci95Lower),
    n(e.ci95Upper),
    e.cefr,
    e.startCefr,
    e.belowScale,
    e.startNode,
    e.remediationNodes,
    e.profile,
    e.stoppingRule,
    e.bktPriorsOverride,
    e.skillTheta,
  );
}
export function diagnosticResultToEntity(d: DiagnosticResult): DiagnosticResultEntity {
  const e = new DiagnosticResultEntity();
  e.id = d.id;
  e.learnerId = d.learnerId;
  e.formVersion = d.formVersion;
  e.createdAt = d.createdAt;
  e.theta = String(d.theta);
  e.seStatistical = String(d.seStatistical);
  e.seParameter = String(d.seParameter);
  e.seEffective = String(d.seEffective);
  e.precisionLabel = d.precisionLabel;
  e.ci95Lower = String(d.ci95Lower);
  e.ci95Upper = String(d.ci95Upper);
  e.cefr = d.cefr;
  e.startCefr = d.startCefr;
  e.belowScale = d.belowScale;
  e.startNode = d.startNode;
  e.remediationNodes = d.remediationNodes;
  e.profile = d.profile;
  e.stoppingRule = d.stoppingRule;
  e.bktPriorsOverride = d.bktPriorsOverride;
  e.skillTheta = d.skillTheta;
  return e;
}

export function diagnosticResponseToDomain(e: DiagnosticResponseEntity): DiagnosticResponse {
  return new DiagnosticResponse(
    e.id,
    e.diagnosticId,
    e.learnerId,
    e.itemId,
    e.skillId,
    e.correct,
    e.responseTimeMs,
    n(e.thetaAfter),
    n(e.seAfter),
  );
}
export function diagnosticResponseToEntity(d: DiagnosticResponse): DiagnosticResponseEntity {
  const e = new DiagnosticResponseEntity();
  e.id = d.id;
  e.diagnosticId = d.diagnosticId;
  e.learnerId = d.learnerId;
  e.itemId = d.itemId;
  e.skillId = d.skillId;
  e.correct = d.correct;
  e.responseTimeMs = d.responseTimeMs;
  e.thetaAfter = String(d.thetaAfter);
  e.seAfter = String(d.seAfter);
  return e;
}

export function diagnosticRunToDomain(result: DiagnosticResultEntity, responses: DiagnosticResponseEntity[]): DiagnosticRun {
  return new DiagnosticRun(diagnosticResultToDomain(result), responses.map(diagnosticResponseToDomain));
}