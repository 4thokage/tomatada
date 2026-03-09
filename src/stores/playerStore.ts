import { createSignal } from "solid-js"
import { applyXP } from "../game/leveling"
import { loadPlayer, savePlayer } from "../db/database"

const [player, setPlayer] = createSignal({
  level: 1,
  xp: 0,
  gold: 0
})

export async function initPlayer() {
  const p = await loadPlayer()

  setPlayer({
    level: p.level,
    xp: p.xp,
    gold: p.gold
  })
}

export function addXP(amount: number) {
  const updated = applyXP(player(), amount)

  setPlayer({
    ...player(),
    level: updated.level,
    xp: updated.xp
  })

  savePlayer({
    id: 1,
    ...player(),
    lastLogin: Date.now()
  })
}

export function addGold(amount: number) {
  setPlayer(p => ({
    ...p,
    gold: p.gold + amount
  }))
}

export function usePlayer() {
  return { player, addXP, addGold }
}
