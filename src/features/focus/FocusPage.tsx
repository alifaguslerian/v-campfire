import { Button } from "../../design-system/components/Button/Button";
import { Card } from "../../design-system/components/Card/Card";
import { PageContainer } from "../../design-system/components/PageContainer/PageContainer";
import { formatSecondsAsClock } from "../../core/utils/time";
import { useFocusStore } from "../../core/focus/store";

export function FocusPage() {
  const { phase, secondsRemaining, isRunning, start, pause, reset } =
    useFocusStore();

  return (
    <PageContainer>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-3xl)",
          marginBottom: 24,
        }}
      >
        Focus
      </h1>

      {phase === "break" && (
        <Card
          style={{
            marginBottom: 16,
            backgroundColor: "var(--color-success)",
          }}
        >
          <strong style={{ color: "var(--bg-base)" }}>
            Break time - step away for a bit.
          </strong>
        </Card>
      )}

      <Card style={{ textAlign: "center", padding: 48 }}>
        <p
          style={{
            color: "var(--text-secondary)",
            marginBottom: 8,
            textTransform: "uppercase",
            fontSize: "var(--text-xs)",
          }}
        >
          {phase === "idle" ? "Ready" : phase}
        </p>
        <div
          className="tabular-nums"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-hero)",
            lineHeight: 1,
            marginBottom: 24,
          }}
        >
          {formatSecondsAsClock(secondsRemaining)}
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          {!isRunning ? (
            <Button variant="primary" onClick={start}>
              {phase === "idle" ? "Start Focus" : "Resume"}
            </Button>
          ) : (
            <Button variant="secondary" onClick={pause}>
              Pause
            </Button>
          )}
          <Button variant="destructive" onClick={reset}>
            Reset
          </Button>
        </div>
      </Card>
    </PageContainer>
  );
}