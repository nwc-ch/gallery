import { justifiedLayout } from './justified-layout';

describe('justified gallery layout', () => {
  const images = [
    { width: 1800, height: 1200 },
    { width: 1000, height: 1500 },
    { width: 1600, height: 900 },
    { width: 1200, height: 1200 },
    { width: 1000, height: 1700 },
    { width: 2400, height: 1000 },
    { width: 900, height: 1200 },
  ];

  it.each([320, 768, 1440])(
    'fills rows at %i px without cropping or reordering images',
    (width) => {
      const rows = justifiedLayout(images, width);
      expect(rows.flatMap((row) => row.items.map((item) => item.index))).toEqual(
        images.map((_, index) => index),
      );
      rows.forEach((row, index) => {
        const used =
          row.items.reduce((sum, item) => sum + item.width, 0) + (row.items.length - 1) * 8;
        expect(used).toBeLessThanOrEqual(width + 0.001);
        if (index < rows.length - 1) expect(used).toBeCloseTo(width, 5);
        row.items.forEach((item) =>
          expect(item.width / row.height).toBeCloseTo(
            images[item.index].width / images[item.index].height,
            5,
          ),
        );
      });
    },
  );

  it('does not stretch a short last row', () => {
    const rows = justifiedLayout([{ width: 1200, height: 800 }], 1200);
    expect(rows[0].height).toBe(220);
    expect(rows[0].items[0].width).toBe(330);
  });

  it('handles empty or hidden containers', () => {
    expect(justifiedLayout([], 800)).toEqual([]);
    expect(justifiedLayout(images, 0)).toEqual([]);
  });
});
