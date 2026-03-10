export interface NFTMetadata {
  id: string
  name: string
  description: string
  image: string
  attributes: {
    trait_type: string
    value: string | number
  }[]
}

export type NFTTrait = "rarity" | "bonus" | "level"

export const NFT_TRAITS = {
  rarity: ["Common", "Uncommon", "Rare", "Epic", "Legendary"],
  bonus: ["xp_boost", "gold_boost", "luck_boost"],
  level: [1, 2, 3, 4, 5]
}

export function generateMockNFT(): NFTMetadata {
  const rarities = NFT_TRAITS.rarity as string[]
  const bonuses = NFT_TRAITS.bonus as string[]

  const rarity = rarities[Math.floor(Math.random() * rarities.length)]
  const bonus = bonuses[Math.floor(Math.random() * bonuses.length)]
  const level = Math.floor(Math.random() * 5) + 1

  return {
    id: crypto.randomUUID(),
    name: `${rarity} Tomatada NFT`,
    description: "A unique NFT from the Tomatada universe",
    image: "/favicon.svg",
    attributes: [
      { trait_type: "Rarity", value: rarity },
      { trait_type: "Bonus Type", value: bonus },
      { trait_type: "Level", value: level }
    ]
  }
}

export function calculateNFTBonus(nft: NFTMetadata | null, type: string): number {
  if (!nft) return 0

  const bonusAttr = nft.attributes.find(a => a.trait_type === "Bonus Type")
  const levelAttr = nft.attributes.find(a => a.trait_type === "Level")

  if (bonusAttr?.value !== type) return 0

  return (levelAttr?.value as number) * 0.05
}

export const mockOwnedNFTs: NFTMetadata[] = []
