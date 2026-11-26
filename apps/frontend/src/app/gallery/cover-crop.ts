import { CoverCrop } from '../dashboard/galleries.service';

export function coverCrop(
  image: { width: number; height: number },
  zoom = 1,
  center = { x: 0.5, y: 0.5 },
): CoverCrop {
  const ratio = image.width / image.height;
  const width = Math.min(1, 1.5 / ratio) / Math.max(1, Math.min(4, zoom));
  const height = Math.min(1, ratio / 1.5) / Math.max(1, Math.min(4, zoom));
  return {
    x: Math.max(0, Math.min(1 - width, center.x - width / 2)),
    y: Math.max(0, Math.min(1 - height, center.y - height / 2)),
    width,
    height,
  };
}
