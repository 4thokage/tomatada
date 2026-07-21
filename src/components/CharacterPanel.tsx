import { usePlayer } from "../stores/playerStore"
import { xpForNextLevel } from "../game/leveling"
import { UPGRADES } from "../game/inventory"

export default function CharacterPanel() {
  const { player } = usePlayer()

  const xpPercent = () =>
    (player().xp / xpForNextLevel(player().level)) * 100

  return (
    <div class="section section--tight">
      <div class="section-title">Character</div>

      <div class="character-row">
        {/* @ts-ignore */}
        <jelly-badge>Lv. <b>{player().level}</b></jelly-badge>{/* @ts-ignore */}
        <jelly-badge>Gold <b>{player().gold}</b></jelly-badge>
      </div>

      <div class="xp-bar-wrapper">
        {/* @ts-ignore */}
        <jelly-progress value={xpPercent()} />
      </div>

      <div class="upgrades-row">
        {UPGRADES.map(u => (
          /* @ts-ignore */
          <jelly-chip title={u.description}>{u.name.split(" ")[0]}: {player().upgrades[u.type]}</jelly-chip>
        ))}
      </div>
    </div>
  )
}
