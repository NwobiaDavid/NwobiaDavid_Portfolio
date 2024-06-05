interface RandomVideoResult<T> {
  video: T;
  index: number;
}

/**
 * Returns a random video from the given array along with its index.
 * @template T The type of elements in the array.
 * @param {T[]} array The array of videos.
 * @returns {RandomVideoResult<T>} An object containing the random video and its index.
 */
export const getRandomVideo = <T>(array: T[]): RandomVideoResult<T> => {
  const randomIndex = Math.floor(Math.random() * array.length);
  const randomVideo = array[randomIndex];
  return { video: randomVideo, index: randomIndex };
};

/**
 * Shuffles the elements of an array in place.
 * 
 * @param array - The array to be shuffled.
 * @returns The shuffled array.
 * @template T - The type of elements in the array.
*/
export const shuffleArray = <T>(array: T[]): T[] => {
  // Fisher-Yates (Knuth) shuffle algorithm
  const shuffledArray = [...array];

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
};
