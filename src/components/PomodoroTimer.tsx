import { createSignal, onCleanup, createEffect } from "solid-js"
import ProgressRing from "./ProgressRing"
import { notifyTimerFinished, requestNotificationPermission } from "../utils/notifications"

type TimerMode = "work" | "shortBreak" | "longBreak"

type Props = {
  onComplete?: () => void
}

const DURATIONS = {
  work: 1500,
  shortBreak: 300,
  longBreak: 900
}

const POMODOROS_FOR_LONG_BREAK = 4

export default function PomodoroTimer(props: Props) {
  const [mode, setMode] = createSignal<TimerMode>("work")
  const [timeLeft, setTimeLeft] = createSignal(DURATIONS.work)
  const [running, setRunning] = createSignal(false)
  const [pomodorosCompleted, setPomodorosCompleted] = createSignal(0)

  let intervalRef: number | undefined

  requestNotificationPermission()

  const totalTime = () => DURATIONS[mode()]

  const stopTimer = () => {
    if (intervalRef) {
      clearInterval(intervalRef)
      intervalRef = undefined
    }
    setRunning(false)
  }

  const startTimer = () => {
    stopTimer()
    setRunning(true)
    intervalRef = window.setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          handleComplete()
          return 0
        }
        return t - 1
      })
    }, 1000)
  }

  const handleComplete = () => {
    stopTimer()

    const currentMode = mode()

    if (currentMode === "work") {
      const completed = pomodorosCompleted() + 1
      setPomodorosCompleted(completed)

      notifyTimerFinished(
        "/sounds/mixkit-elevator-tone-2863.wav",
        "Pomodoro Complete 🍅",
        "Great work! Time for a break.",
        "/favicon.svg"
      )

      props.onComplete?.()

      if (completed % POMODOROS_FOR_LONG_BREAK === 0) {
        setMode("longBreak")
        setTimeLeft(DURATIONS.longBreak)
      } else {
        setMode("shortBreak")
        setTimeLeft(DURATIONS.shortBreak)
      }
    } else {
      notifyTimerFinished(
        "/sounds/mixkit-elevator-tone-2863.wav",
        "Break Over 🎯",
        "Ready to focus? Let's go!",
        "/favicon.svg"
      )
      setMode("work")
      setTimeLeft(DURATIONS.work)
    }
  }

  const toggle = () => {
    if (running()) {
      stopTimer()
    } else {
      startTimer()
    }
  }

  const reset = () => {
    stopTimer()
    setMode("work")
    setTimeLeft(DURATIONS.work)
  }

  const skip = () => {
    stopTimer()
    if (mode() === "work") {
      const completed = pomodorosCompleted()
      if ((completed + 1) % POMODOROS_FOR_LONG_BREAK === 0) {
        setMode("longBreak")
        setTimeLeft(DURATIONS.longBreak)
      } else {
        setMode("shortBreak")
        setTimeLeft(DURATIONS.shortBreak)
      }
    } else {
      setMode("work")
      setTimeLeft(DURATIONS.work)
    }
  }

  const setTimerMode = (newMode: TimerMode) => {
    stopTimer()
    setMode(newMode)
    setTimeLeft(DURATIONS[newMode])
  }

  onCleanup(() => stopTimer())

  createEffect(() => {
    if (running()) {
      const formatted = format()
      const label = mode() === "work" ? "🍅" : "☕"
      document.title = `${formatted} ${label} Tomatada`
    } else {
      document.title = "Tomatada"
    }
  })

  const progress = () => 1 - timeLeft() / totalTime()

  const format = () => {
    const m = Math.floor(timeLeft() / 60)
    const s = timeLeft() % 60
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  const modeLabel = () => {
    switch (mode()) {
      case "work": return "Focus"
      case "shortBreak": return "Short break"
      case "longBreak": return "Long break"
    }
  }

  return (
    <div class="section section--hero">
      {/* @ts-ignore */}
      <jelly-tabs>{/* @ts-ignore */}
        <jelly-tab-panel label="Focus" active={mode() === "work" ? "" : undefined} onClick={() => setTimerMode("work")} />{/* @ts-ignore */}
        <jelly-tab-panel label="Short" active={mode() === "shortBreak" ? "" : undefined} onClick={() => setTimerMode("shortBreak")} />{/* @ts-ignore */}
        <jelly-tab-panel label="Long" active={mode() === "longBreak" ? "" : undefined} onClick={() => setTimerMode("longBreak")} />{/* @ts-ignore */}
      </jelly-tabs>

      <div class="timer-wrapper">
        <ProgressRing progress={progress()} radius={110} stroke={3} />
        <div class="timer-text">
          {format()}
        </div>
      </div>

      <div class="timer-label">{modeLabel()}</div>

      <div class="timer-controls">
        {/* @ts-ignore */}
        <jelly-button onClick={reset}>Reset</jelly-button>{/* @ts-ignore */}
        <jelly-button variant="mint" onClick={toggle}>{running() ? "❚❚" : "▶"}</jelly-button>{/* @ts-ignore */}
        <jelly-button onClick={skip}>Skip →</jelly-button>
      </div>

      <div class="timer-count">
        {/* @ts-ignore */}
        <jelly-badge>{pomodorosCompleted()} completed</jelly-badge>
      </div>
    </div>
  )
}
