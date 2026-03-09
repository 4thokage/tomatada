import { createSignal, onCleanup } from "solid-js"
import ProgressRing from "./ProgressRing"
import { notifyTimerFinished, requestNotificationPermission } from "../utils/notifications";

type Props = {
  onComplete?: () => void
}

const TOTAL = 1500

export default function PomodoroTimer(props: Props) {

  const [timeLeft, setTimeLeft] = createSignal(TOTAL)
  const [running, setRunning] = createSignal(false)

  let interval: number | undefined

  requestNotificationPermission();

  const toggle = () => {

    if (running()) {
      clearInterval(interval)
      setRunning(false)
      return
    }

    setRunning(true)

    interval = window.setInterval(() => {

      setTimeLeft(t => {

        if (t <= 1) {
          clearInterval(interval)
          setRunning(false)

          props.onComplete?.()

          return TOTAL
        }

        return t - 1
      })

    }, 1000)
  }

  const reset = () => {
    clearInterval(interval)
    setRunning(false)
    setTimeLeft(TOTAL)
  }

  onCleanup(() => clearInterval(interval))

  const progress = () => 1 - timeLeft() / TOTAL

  const format = () => {
    const m = Math.floor(timeLeft() / 60)
    const s = timeLeft() % 60
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  return (
    <div class="panel">

      <div class="timer-wrapper">

        <ProgressRing progress={progress()} radius={120} stroke={10} />

        <div class="timer-text">
          {format()}
        </div>

      </div>

      <div class="button-group">

        <button
          class="btn-toggle"
          onClick={toggle}
        >
          {running() ? "❚❚" : "▶"}
        </button>

        <button
          class="btn-reset"
          onClick={reset}
        >
          Reset
        </button>

      </div>

    </div>
  )
}
