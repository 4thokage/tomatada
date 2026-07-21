import { For } from "solid-js"
import { usePlayer } from "../stores/playerStore"
import { UPGRADES, UpgradeType } from "../game/inventory"

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
    <div class="section">
      <div class="shop-header">
        <div class="section-title">Shop</div>
        {/* @ts-ignore */}
        <jelly-badge><b>{player().gold}</b> gold</jelly-badge>
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
              /* @ts-ignore */
              <jelly-card><div class="shop-item">
                <div class="item-info">
                  <div class="item-name">{upgrade.name}</div>
                  <div class="item-desc">{upgrade.description}</div>
                  {/* @ts-ignore */}
                  <jelly-badge>Lv. {level()} / {maxLevel}</jelly-badge>
                </div>
                {/* @ts-ignore */}
                <jelly-button variant="mint" onClick={() => handleBuy(type)} disabled={!affordable() || maxed()}>{maxed() ? "MAX" : `${cost()} gold`}</jelly-button>
              </div>{/* @ts-ignore */}
              </jelly-card>
            )
          }}
        </For>
      </div>
    </div>
  )
}
