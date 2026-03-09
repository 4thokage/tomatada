import Dexie, { Table } from "dexie"

export type Task = {
  id: string
  title: string
  completed: boolean
}

export type Player = {
  id: number
  level: number
  xp: number
  gold: number
  lastLogin: number
}

class TomatadaDB extends Dexie {
  tasks!: Table<Task>
  player!: Table<Player>

  constructor() {
    super("tomatada")

    this.version(1).stores({
      tasks: "id, title, completed",
      player: "id"
    })
  }
}

export const db = new TomatadaDB()

export async function loadPlayer() {
  const player = await db.player.get(1)

  if (!player) {
    const newPlayer = {
      id: 1,
      level: 1,
      xp: 0,
      gold: 0,
      lastLogin: Date.now()
    }

    await db.player.put(newPlayer)
    return newPlayer
  }

  return player
}

export async function savePlayer(player: Player) {
  await db.player.put(player)
}

export async function loadTasks() {
  return db.tasks.toArray()
}

export async function saveTask(task: Task) {
  await db.tasks.put(task)
}

export async function deleteTask(id: string) {
  await db.tasks.delete(id)
}
