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
      case "work": return "Focus Time"
      case "shortBreak": return "Short Break"
      case "longBreak": return "Long Break"
    }
  }

  const modeClass = () => `mode-${mode()}`

  return (
    <div class="panel">
      <div class={`timer-modes ${modeClass()}`}>
        <button
          class={`mode-btn ${mode() === "work" ? "active" : ""}`}
          onClick={() => setTimerMode("work")}
        >
          Work
        </button>
        <button
          class={`mode-btn ${mode() === "shortBreak" ? "active" : ""}`}
          onClick={() => setTimerMode("shortBreak")}
        >
          Short Break
        </button>
        <button
          class={`mode-btn ${mode() === "longBreak" ? "active" : ""}`}
          onClick={() => setTimerMode("longBreak")}
        >
          Long Break
        </button>
      </div>

      <div class="timer-wrapper">
        <ProgressRing progress={progress()} radius={120} stroke={10} />
        <div class="timer-text">
          {format()}
        </div>
      </div>

      <div class="timer-status">
        {modeLabel()}
      </div>

      <div class="pomodoro-count">
        {pomodorosCompleted()} pomodoros completed
      </div>

      <div class="button-group">
        <button class="btn-toggle" onClick={toggle}>
          {running() ? "❚❚" : "▶"}
        </button>
        <button class="btn-reset" onClick={reset}>
          Reset
        </button>
        <button class="btn-skip" onClick={skip}>
          Skip →
        </button>
      </div>
    </div>
  )
}
