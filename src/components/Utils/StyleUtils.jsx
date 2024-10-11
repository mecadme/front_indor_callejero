import React from "react";

const StyleUtils = () => {
  const lightenColor = (color, percent) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return `#${(
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
      .toUpperCase()}`;
  };

  const getTextColor = (bgColor) => {
    const color = bgColor.replace("#", "");
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 155 ? "#000" : "#fff";
  };

  const zigZagSvg = (color, lightColor) => {
    return `
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="zigzag" patternUnits="userSpaceOnUse" width="200" height="200" patternTransform="scale(10)">
            <path d="M0,0 L0,200 " stroke="${color}" stroke-width="800" fill="none"/>
            <path d="M-5,0 L20,40" stroke="${lightColor}" stroke-width="20" fill="${lightColor}"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#zigzag)" />
        </svg>`;
  };

  return {
    lightenColor,
    getTextColor,
    zigZagSvg,
  };
};

export default StyleUtils;
