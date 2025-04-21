export default function svgCursor(adjustedBrushSize: number, brushRadius: number) {
    return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${adjustedBrushSize}' height='${adjustedBrushSize}' fill='none' stroke='%236173f3' stroke-width='1' viewBox='0 0 ${adjustedBrushSize} ${adjustedBrushSize}' %3E%3Ccircle cx='${brushRadius}' cy='${brushRadius}' r='${
      brushRadius - 1
    }' fill='none' stroke='%236173f3'/%3E%3Cline x1='${brushRadius}' y1='${brushRadius - 5}' x2='${brushRadius}' y2='${
      brushRadius + 5
    }' stroke='%236173f3'/%3E%3Cline x1='${brushRadius - 5}' y1='${brushRadius}' x2='${
      brushRadius + 5
    }' y2='${brushRadius}' stroke='%236173f3'/%3E%3C/svg%3E") ${brushRadius} ${brushRadius}, auto`;
  }