// Global focus timer state - deliberately outside any feature folder and
// outside React component state, same reasoning as src/core/audio/store.ts:
// must keep counting down across route changes, and be readable from
// anywhere (e.g. a mini indicator in the sidebar while another page is open).

import { create } from "zustand";
import { recordFocusSession } from "../db/focusSessions";

export type FocusPhase = "idle" | "focus" | "break";

const FOCUS_DURATION_SECONDS = 25 * 60;
const BREAK_DURATION_SECONDS = 5 * 60;

interface FocusState {
  phase: FocusPhase;
  secondsRemaining: number;
  isRunning: boolean;
  phaseStartedAt: string | null;
  start: () => void;
  pause: () => void;
  reset: () => void;
  tick: () => void;
}

export const useFocusStore = create<FocusState>((set, get) => ({
  phase: "idle",
  secondsRemaining: FOCUS_DURATION_SECONDS,
  isRunning: false,
  phaseStartedAt: null,

  start: () => {
    const { phase, secondsRemaining, phaseStartedAt } = get();
    const startingFresh = phase === "idle";
    set({
      isRunning: true,
      phase: startingFresh ? "focus" : phase,
      phaseStartedAt: startingFresh ? new Date().toISOString() : phaseStartedAt,
      secondsRemaining: startingFresh ? FOCUS_DURATION_SECONDS : secondsRemaining,
    });
  },

  pause: () => set({ isRunning: false }),

  reset: () =>
    set({
      phase: "idle",
      isRunning: false,
      secondsRemaining: FOCUS_DURATION_SECONDS,
      phaseStartedAt: null,
    }),

  tick: () => {
    const { secondsRemaining, phase, phaseStartedAt, isRunning } = get();
    if (!isRunning || phase === "idle") return;

    if (secondsRemaining <= 1) {
      // Phase complete - record the session, then flip to the other phase
      // and auto-continue (matches how pomodoro is meant to flow).
      const now = new Date().toISOString();
      const completedDuration =
        phase === "focus" ? FOCUS_DURATION_SECONDS : BREAK_DURATION_SECONDS;

      if (phaseStartedAt) {
        recordFocusSession({
          type: phase,
          startedAt: phaseStartedAt,
          endedAt: now,
          durationSeconds: completedDuration,
        });
      }

      const nextPhase: FocusPhase = phase === "focus" ? "break" : "focus";
      set({
        phase: nextPhase,
        secondsRemaining:
          nextPhase === "focus"
            ? FOCUS_DURATION_SECONDS
            : BREAK_DURATION_SECONDS,
        phaseStartedAt: now,
        isRunning: true,
      });
    } else {
      set({ secondsRemaining: secondsRemaining - 1 });
    }
  },
}));
