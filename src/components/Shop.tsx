import { For } from "solid-js"
import { usePlayer } from "../stores/playerStore"
import { UPGRADES, getUpgradeCost, UpgradeType } from "../game/inventory"

export default function Shop() {
  const { player, buyUpgrade, canAffordUpgrade, getUpgradeCostFor } = usePlayer()

  const handleBuy = (type: UpgradeType) => {
    buyUpgrade(type)
  }

  const getLevel = (type: UpgradeType) => player().upgrades[type]
  const getMaxLevel = (type: UpgradeType) => {
    const upgrade = UPGRADES.find(u => u.type === type)
    return upgrade?.maxLevel ?? 0
  }

  return (
    <div class="panel">
      <div class="title-section">
        Shop
      </div>
      <div class="shop-gold">
        <span class="gold-icon">🪙</span>
        <span>{player().gold} Gold</span>
      </div>

      <div class="shop-items">
        <For each={UPGRADES}>
          {(upgrade) => {
            const type = upgrade.type
            const level = () => getLevel(type)
            const maxLevel = getMaxLevel(type)
            const cost = () => getUpgradeCostFor(type)
            const affordable = () => canAffordUpgrade(type)
            const maxed = () => level() >= maxLevel

            return (
              <div class="shop-item">
                <div class="item-info">
                  <div class="item-name">{upgrade.name}</div>
                  <div class="item-desc">{upgrade.description}</div>
                  <div class="item-level">
                    Level {level()} / {maxLevel}
                  </div>
                </div>
                <button
                  class={`btn-buy ${!affordable() || maxed() ? "disabled" : ""}`}
                  onClick={() => handleBuy(type)}
                  disabled={!affordable() || maxed()}
                >
                  {maxed() ? "MAX" : `${cost()} 🪙`}
                </button>
              </div>
            )
          }}
        </For>
      </div>
    </div>
  )
}
