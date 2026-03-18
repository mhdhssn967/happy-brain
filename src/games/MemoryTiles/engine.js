export const generateTiles = (size) => {
  const total = size * size
  return Array.from({ length: total }, (_, i) => ({
    id: i,
    active: false,
    clicked: false,
    status: null, // correct | wrong
  }))
}

export const pickRandomTiles = (tiles, count) => {
  const shuffled = [...tiles].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count).map(t => t.id)
}