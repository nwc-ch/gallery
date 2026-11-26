import { coverCrop } from './cover-crop';

describe('album cover crop geometry', () => {
  it.each([
    { width: 1800, height: 1200 },
    { width: 1000, height: 1500 },
    { width: 4000, height: 1000 },
  ])('preserves 3:2 and stays inside $width × $height images', (image) => {
    for (const zoom of [1, 2, 4]) {
      for (const center of [
        { x: 0.5, y: 0.5 },
        { x: -1, y: -1 },
        { x: 2, y: 2 },
      ]) {
        const crop = coverCrop(image, zoom, center);
        expect(crop.x).toBeGreaterThanOrEqual(0);
        expect(crop.y).toBeGreaterThanOrEqual(0);
        expect(crop.x + crop.width).toBeLessThanOrEqual(1.000001);
        expect(crop.y + crop.height).toBeLessThanOrEqual(1.000001);
        expect((crop.width * image.width) / (crop.height * image.height)).toBeCloseTo(1.5);
      }
    }
  });
});
