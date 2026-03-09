export function calculateOfflineProgress(
  lastTimestamp: number,
  now: number,
  goldRate: number
) {
  const delta = now - lastTimestamp

  const goldEarned = Math.floor(delta * goldRate)

  return {
    elapsedTime: delta,
    goldEarned
  }
}
