/**
 * Utility functions for color manipulation and branding
 */

/**
 * Converts a hex color to an RGBA string with the given alpha
 * @param hex Hex color string (e.g., #ffffff or #fff)
 * @param alpha Alpha value (0 to 1)
 * @returns RGBA string
 */
export const hexToRgba = (hex: string, alpha: number): string => {
  let r = 0, g = 0, b = 0;
  
  // Handle shorthand hex
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * Checks if a color is "light" or "dark" based on perceived luminance
 * @param hex Hex color string
 * @returns True if the color is light, false otherwise
 */
export const isLightColor = (hex: string): boolean => {
  if (!hex || hex.length < 4) return false;
  
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }
  
  // Perceptual luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6;
};

/**
 * Generates shades for a base color
 * @param hex Base hex color
 * @returns Object with various shades
 */
export const generateColorShades = (hex: string) => {
  return {
    light: hexToRgba(hex, 0.1),
    medium: hexToRgba(hex, 0.5),
    solid: hex,
    dark: hexToRgba(hex, 0.9)
  };
};
