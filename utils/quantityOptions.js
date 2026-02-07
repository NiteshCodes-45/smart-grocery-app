export const WEIGHT_OPTIONS_GM = [250, 500, 750, 1000];
export const VOLUME_OPTIONS_ML = [250, 500, 750, 1000];

function generateOptions({ start, step, max }) {
  const options = [];
  for (let value = start; value <= max; value += step) {
    options.push(Number(value.toFixed(2)));
  }
  return options;
}

export function getQuantityOptions(unit, unitType) {
  if (unitType === "WEIGHT") {
    // grams
    if (unit === "gm") {
      return generateOptions({
        start: 250,
        step: 250,
        max: 10000, // 10 kg in gm
      });
    }

    // kilograms
    return generateOptions({
      start: 0.5,
      step: 0.5,
      max: 10,
    });
  }

  if (unitType === "VOLUME") {
    // milliliters
    if (unit === "ml") {
      return generateOptions({
        start: 250,
        step: 250,
        max: 10000, // 10 ltr in ml
      });
    }

    // liters
    return generateOptions({
      start: 0.5,
      step: 0.5,
      max: 10,
    });
  }

  return [];
}

