/**
 * Pads a number with a leading zero if it is less than 10.
 * 
 * @param number - The number to pad.
 * @returns The padded number as a string.
 */
const pad = (number: number) => {
  return number < 10 ? "0" + number : number;
};

/**
 * Converts seconds to a formatted time string in the format HH:MM:SS.
 * 
 * @param seconds - The number of seconds to be converted.
 * @returns The formatted time string.
 */
export const secondsToTimeString = (seconds: number) => {
  // Calculate hours, minutes, and seconds
  const hours = Math.floor(seconds / 3600);
  const remainingSeconds = seconds % 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  const leftoverSeconds = remainingSeconds % 60;

  // Convert to string format HH:MM:SS
  const timeString = pad(hours) + ":" + pad(minutes) + ":" + pad(leftoverSeconds);

  return timeString;
};
