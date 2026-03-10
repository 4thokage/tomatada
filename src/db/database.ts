import Dexie, { Table } from "dexie"
import { PlayerUpgrades } from "../game/inventory"

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
  upgrades: PlayerUpgrades
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

    this.version(2).stores({
      tasks: "id, title, completed",
      player: "id"
    }).upgrade(tx => {
      return tx.table("player").toCollection().modify(player => {
        player.upgrades = { focus: 0, luck: 0, strength: 0 }
      })
    })
  }
}

export const db = new TomatadaDB()

export async function loadPlayer(): Promise<Player> {
  const player = await db.player.get(1)

  if (!player) {
    const newPlayer: Player = {
      id: 1,
      level: 1,
      xp: 0,
      gold: 0,
      lastLogin: Date.now(),
      upgrades: { focus: 0, luck: 0, strength: 0 }
    }

    await db.player.put(newPlayer)
    return newPlayer
  }

  if (!player.upgrades) {
    player.upgrades = { focus: 0, luck: 0, strength: 0 }
    await db.player.put(player)
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
