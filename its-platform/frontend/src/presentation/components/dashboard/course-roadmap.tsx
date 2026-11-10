"use client";

import Link from "next/link";
import { Badge } from "@/presentation/components/ui/badge";
import { buttonClasses } from "@/presentation/components/ui/button";
import { routes } from "@/shared/routes";

export type RoadmapLesson = {
  id: string;
  title: string;
  durationMinutes: number | null;
  isUnlocked: boolean;
  isCompleted: boolean;
};

export type RoadmapModule = {
  id: string;
  index: number;
  title: string;
  description: string | null;
  isUnlocked: boolean;
  lessons: RoadmapLesson[];
};

export function CourseRoadmap({ modules }: { modules: RoadmapModule[] }) {
  return (
    <div className="flex flex-col gap-6">
      {modules.map((mod) => (
        <div key={mod.id} className="rounded-2xl border border-subtle bg-surface p-5 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Badge tone="neutral">Módulo {mod.index.toString().padStart(2, "0")}</Badge>
                {!mod.isUnlocked && <Badge tone="warning">Bloqueado</Badge>}
              </div>
              <h2 className="mt-2 text-lg font-semibold">{mod.title}</h2>
              {mod.description && <p className="text-sm text-ink-600">{mod.description}</p>}
            </div>
            <p className="text-xs text-ink-500">
              {mod.lessons.length} {mod.lessons.length === 1 ? "aula" : "aulas"}
              {mod.lessons.some((l) => l.durationMinutes)
                ? ` · ${formatMinutes(mod.lessons.reduce((s, l) => s + (l.durationMinutes ?? 0), 0))}`
                : ""}
            </p>
          </div>

          <div className="mt-5 flex flex-col divide-y divide-subtle">
            {mod.lessons.map((lesson, idx) => {
              const state = lesson.isCompleted ? "completed" : lesson.isUnlocked ? "unlocked" : "locked";
              const href = lesson.isUnlocked ? routes.lesson(lesson.id) : undefined;
              return (
                <div key={lesson.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full border text-xs"
                      style={{
                        borderColor: state === "completed" ? "hsl(var(--success))" : state === "unlocked" ? "hsl(var(--primary))" : "hsl(var(--border-subtle))",
                        color: state === "completed" || state === "unlocked" ? "hsl(var(--ink))" : "hsl(var(--ink-500))",
                        background: state === "completed" ? "hsla(var(--success) / 0.12)" : "transparent",
                      }}
                    >
                      {state === "completed" ? "✓" : idx + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{lesson.title}</p>
                      {lesson.durationMinutes && <p className="text-xs text-ink-500">{formatMinutes(lesson.durationMinutes)}</p>}
                    </div>
                  </div>
                  {href ? (
                    <Link href={href} className={buttonClasses("ghost", "sm")}>
                      {lesson.isCompleted ? "Revisar" : "Continuar"}
                    </Link>
                  ) : (
                    <span className="text-xs text-ink-500">Bloqueado</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function formatMinutes(m: number): string {
  if (m <= 0) return "";
  const h = Math.floor(m / 60);
  const mm = Math.floor(m % 60);
  if (h > 0) return `${h}h ${mm}min`.trim();
  return `${mm}min`;
}
