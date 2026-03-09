import { createSignal } from "solid-js"
import { Task, loadTasks, saveTask, deleteTask } from "../db/database"

const [tasks, setTasks] = createSignal<Task[]>([])

export async function initTasks() {
  const loaded = await loadTasks()
  setTasks(loaded)
}

export function addTask(title: string) {
  const task: Task = {
    id: crypto.randomUUID(),
    title,
    completed: false
  }

  setTasks(t => [...t, task])
  saveTask(task)
}

export function toggleTask(id: string) {
  setTasks(t =>
    t.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    )
  )
}

export function removeTask(id: string) {
  setTasks(t => t.filter(task => task.id !== id))
  deleteTask(id)
}

export function useTasks() {
  return { tasks, addTask, toggleTask, removeTask }
}
