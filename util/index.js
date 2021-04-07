const { abs, log10, pow, round } = Math;

const SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];

export const percent = (value, total) =>
  round(value * 100 / total) || 0;


/**
 * @url https://stackoverflow.com/a/40724354
 */
export const prettyNumber = (num) => {
    var tier = log10(abs(num)) / 3 | 0;

    if (tier == 0) return num;

    const suffix = SI_SYMBOL[tier];
    const scale = pow(10, tier * 3);
    const scaled = num / scale;

    return scaled.toFixed(1) + suffix;
}

