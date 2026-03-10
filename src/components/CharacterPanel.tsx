import { usePlayer } from "../stores/playerStore"
import { xpForNextLevel } from "../game/leveling"
import { UPGRADES } from "../game/inventory"

export default function CharacterPanel() {

  const { player } = usePlayer()

  const xpPercent = () =>
    (player().xp / xpForNextLevel(player().level)) * 100

  return (
    <div class="panel">
      <div class="title-section">
        Character
      </div>
      <div class="character-stats">
        <div class="stat">
          <div>Level</div>
          <b>{player().level}</b>
        </div>
        <div class="stat">
          <div>Gold</div>
          <b>🪙 {player().gold}</b>
        </div>
      </div>
      <div class="xp-container">
        <div class="xp-bar-bg">
          <div
            class="xp-bar-fill"
            style={{
              width: `${xpPercent()}%`
            }}
          />
        </div>
      </div>
      <div class="upgrades-summary">
        {UPGRADES.map(u => (
          <div class="upgrade-badge" title={u.description}>
            {u.name.split(" ")[0]}: {player().upgrades[u.type]}
          </div>
        ))}
      </div>
    </div>
  )
}
