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
    <div class="app-container">
      <h1 class="title-main">Tomatada</h1>

      <CharacterPanel />

      <PomodoroTimer onComplete={rewardPomodoro} />

      <TaskList />

      <Shop />
    </div>
  )
}
