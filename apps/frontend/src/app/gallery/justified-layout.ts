export interface ImageSize {
  width: number;
  height: number;
}
export interface JustifiedItem {
  index: number;
  width: number;
}
export interface JustifiedRow {
  height: number;
  items: JustifiedItem[];
}

/** Fit complete rows exactly, keep aspect ratios and leave the final row unstretched. */
export function justifiedLayout(
  images: readonly ImageSize[],
  containerWidth: number,
  targetHeight = 220,
  gap = 8,
): JustifiedRow[] {
  if (!images.length || containerWidth <= 0 || targetHeight <= 0 || gap < 0) return [];
  const rows: JustifiedRow[] = [];
  let pending: { index: number; ratio: number }[] = [];
  let ratioSum = 0;
  const finish = (last: boolean) => {
    const available = Math.max(1, containerWidth - gap * (pending.length - 1));
    const fittedHeight = available / ratioSum;
    const height = last ? Math.min(targetHeight, fittedHeight) : fittedHeight;
    rows.push({
      height,
      items: pending.map((item) => ({ index: item.index, width: item.ratio * height })),
    });
    pending = [];
    ratioSum = 0;
  };
  images.forEach((image, index) => {
    const ratio = image.width > 0 && image.height > 0 ? image.width / image.height : 1;
    pending.push({ index, ratio });
    ratioSum += ratio;
    const fitted = (containerWidth - gap * (pending.length - 1)) / ratioSum;
    if (fitted <= targetHeight) {
      if (pending.length > 1) {
        const previous = (containerWidth - gap * (pending.length - 2)) / (ratioSum - ratio);
        if (Math.abs(previous - targetHeight) < Math.abs(fitted - targetHeight)) {
          pending.pop();
          ratioSum -= ratio;
          finish(false);
          pending.push({ index, ratio });
          ratioSum = ratio;
          return;
        }
      }
      finish(false);
    }
  });
  if (pending.length) finish(true);
  return rows;
}
