import { createSignal } from "solid-js"
import { applyXP } from "../game/leveling"
import { loadPlayer, savePlayer, Player } from "../db/database"
import { PlayerUpgrades, getUpgradeCost, getXPBonus, getGoldBonus, rollForLuckyGold, UPGRADES, UpgradeType } from "../game/inventory"

const defaultPlayerState: Player = {
  id: 1,
  level: 1,
  xp: 0,
  gold: 0,
  lastLogin: Date.now(),
  upgrades: { focus: 0, luck: 0, strength: 0 }
}

const [player, setPlayer] = createSignal<Player>(defaultPlayerState)

export { player }

export async function initPlayer() {
  const p = await loadPlayer()
  setPlayer(p)
}

export function addXP(amount: number) {
  const current = player()
  const bonus = getXPBonus(amount, current.upgrades.focus)
  const totalXP = amount + bonus

  const updated = applyXP({ level: current.level, xp: current.xp }, totalXP)

  setPlayer(p => ({
    ...p,
    level: updated.level,
    xp: updated.xp
  }))

  savePlayer({
    ...current,
    level: updated.level,
    xp: updated.xp
  })
}

export function addGold(amount: number) {
  const current = player()
  const bonus = getGoldBonus(amount, current.upgrades.strength)
  const luckyBonus = rollForLuckyGold(amount, current.upgrades.luck)
  const totalGold = amount + bonus + luckyBonus

  setPlayer(p => ({
    ...p,
    gold: p.gold + totalGold
  }))

  savePlayer({
    ...current,
    gold: current.gold + totalGold
  })
}

export function buyUpgrade(type: UpgradeType): boolean {
  const current = player()
  const upgrade = UPGRADES.find(u => u.type === type)
  
  if (!upgrade) return false

  const currentLevel = current.upgrades[type]
  if (currentLevel >= upgrade.maxLevel) return false

  const cost = getUpgradeCost(upgrade, currentLevel)
  
  if (current.gold < cost) return false

  const newUpgrades: PlayerUpgrades = {
    ...current.upgrades,
    [type]: currentLevel + 1
  }

  setPlayer(p => ({
    ...p,
    gold: p.gold - cost,
    upgrades: newUpgrades
  }))

  savePlayer({
    ...current,
    gold: current.gold - cost,
    upgrades: newUpgrades
  })

  return true
}

export function canAffordUpgrade(type: UpgradeType): boolean {
  const current = player()
  const upgrade = UPGRADES.find(u => u.type === type)
  
  if (!upgrade) return false
  
  const currentLevel = current.upgrades[type]
  if (currentLevel >= upgrade.maxLevel) return false

  const cost = getUpgradeCost(upgrade, currentLevel)
  return current.gold >= cost
}

export function getUpgradeCostFor(type: UpgradeType): number {
  const current = player()
  const upgrade = UPGRADES.find(u => u.type === type)
  
  if (!upgrade) return 0
  
  return getUpgradeCost(upgrade, current.upgrades[type])
}

export function usePlayer() {
  return { player, addXP, addGold, buyUpgrade, canAffordUpgrade, getUpgradeCostFor }
}
