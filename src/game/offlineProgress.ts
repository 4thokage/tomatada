export function calculateOfflineProgress(
  lastTimestamp: number,
  now: number,
  goldRate: number
) {
  const delta = now - lastTimestamp

  const goldEarned = 0

  return {
    elapsedTime: delta,
    goldEarned
  }
}
