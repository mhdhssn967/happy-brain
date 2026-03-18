/**
 * Sequence Recall Game Engine
 */

/**
 * Generate 4 random unique images from available 20 images
 */
export const generateSequence = (count, level) => {
  // Randomly select 4 unique images from 1-20
  const availableImages = Array.from({ length: 20 }, (_, i) => i + 1);
  const selectedImages = [];
  
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * availableImages.length);
    selectedImages.push(availableImages[randomIndex]);
    availableImages.splice(randomIndex, 1);
  }

  const items = [];
  for (let i = 0; i < count; i++) {
    items.push({
      id: i,
      imageNum: selectedImages[i], // Random image from 1-20
      position: i,
    });
  }
  return items;
};

/**
 * Shuffle sequence items
 */
export const shuffleSequence = (items) => {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};