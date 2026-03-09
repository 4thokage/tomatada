export type PlayerState = {
  level: number
  xp: number
}

export function xpForNextLevel(level: number): number {
  return Math.floor((level / 0.07) ** 2)
}

export function applyXP(player: PlayerState, gainedXP: number): PlayerState {
  let xp = player.xp + gainedXP
  let level = player.level

  while (xp >= xpForNextLevel(level)) {
    xp -= xpForNextLevel(level)
    level++
  }

  return { level, xp }
}
