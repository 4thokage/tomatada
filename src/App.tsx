import { onMount } from "solid-js"
import PomodoroTimer from "./components/PomodoroTimer"
import TaskList from "./components/TaskList"
import CharacterPanel from "./components/CharacterPanel"
import Shop from "./components/Shop"
import { initPlayer, addXP, addGold } from "./stores/playerStore"
import { initTasks } from "./stores/taskStore"

export default function App() {
  onMount(async () => {
    await initPlayer()
    await initTasks()
  })

  const rewardPomodoro = () => {
    addXP(50)
    addGold(20)
  }

  return (
    // @ts-ignore -- jelly-theme is a web component loaded at runtime
    <jelly-theme mode="dark">
      <div class="app-container">
        <PomodoroTimer onComplete={rewardPomodoro} />

        <CharacterPanel />

        <TaskList />

        <Shop />
      </div>
    {/* @ts-ignore */}
    </jelly-theme>
  )
}
