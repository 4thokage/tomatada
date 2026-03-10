export type UpgradeType = "focus" | "luck" | "strength"

export type Upgrade = {
  id: string
  name: string
  description: string
  type: UpgradeType
  baseCost: number
  costMultiplier: number
  maxLevel: number
}

export type PlayerUpgrades = Record<UpgradeType, number>

export const UPGRADES: Upgrade[] = [
  {
    id: "focus",
    name: "Focus Ring",
    description: "+10% XP per pomodoro",
    type: "focus",
    baseCost: 50,
    costMultiplier: 1.5,
    maxLevel: 10
  },
  {
    id: "luck",
    name: "Lucky Charm",
    description: "+5% chance for bonus gold",
    type: "luck",
    baseCost: 75,
    costMultiplier: 1.6,
    maxLevel: 10
  },
  {
    id: "strength",
    name: "Gold Amplifier",
    description: "+10% gold per pomodoro",
    type: "strength",
    baseCost: 60,
    costMultiplier: 1.5,
    maxLevel: 10
  }
]

export function getUpgradeCost(upgrade: Upgrade, currentLevel: number): number {
  return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel))
}

export function getXPBonus(baseXP: number, focusLevel: number): number {
  return Math.floor(baseXP * (focusLevel * 0.1))
}

export function getGoldBonus(baseGold: number, strengthLevel: number): number {
  return Math.floor(baseGold * (strengthLevel * 0.1))
}

export function rollForLuckyGold(baseGold: number, luckLevel: number): number {
  if (luckLevel > 0 && Math.random() < luckLevel * 0.05) {
    return Math.floor(baseGold * 0.5)
  }
  return 0
}

export const defaultUpgrades: PlayerUpgrades = {
  focus: 0,
  luck: 0,
  strength: 0
}
