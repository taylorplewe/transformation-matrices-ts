// types
interface Point {
  x: number;
  y: number;
}
type Matrix = number[][];

// state
const org: Point = { x: 0.5, y: 0.5 };
let points: Point[] = [
  { x: 0.5, y: 0.25 },
  { x: 0.25, y: 0.5 },
  { x: 0.5, y: 0.75 },
  { x: 0.75, y: 0.5 },
];
const keysDown: boolean[] = new Array(256).fill(false);

// init
const canvasSize = 600;
const canvasEl = document.createElement("canvas");
canvasEl.width = canvasSize;
canvasEl.height = canvasSize;
canvasEl.style.width = `${canvasSize}px`;

const mountElOrNull = document.querySelector("#canvas-mount");
if (mountElOrNull === null)
  throw new Error("Could not get element with ID 'canvas-mount'");
const mountEl: Element = mountElOrNull;
mountEl.appendChild(canvasEl);

const ctxOrNull = canvasEl.getContext("2d");
if (ctxOrNull === null) throw new Error("Could not get canvas context");
const ctx: CanvasRenderingContext2D = ctxOrNull;

// helpers
const getScaleMatrix = (scale: number) => [
  [scale, 0],
  [0, scale],
];
const getRotationMatrix = (radians: number) => [
  [Math.cos(radians), -Math.sin(radians)],
  [Math.sin(radians), Math.cos(radians)],
];
const multiplyMatrices = (m1: Matrix, m2: Matrix): Matrix => {
  const result: Matrix = new Array(2).fill(0).map(() => new Array(2).fill(0));
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 2; col++) {
      for (let i = 0; i < 2; i++) {
        result[row][col] += m1[row][i] * m2[i][col];
      }
    }
  }
  return result;
};
const transformPoints = (
  points: Point[],
  origin: Point,
  matrix: Matrix,
): Point[] => {
  const transformedPoints: Point[] = [];
  for (const point of points) {
    const localX = point.x - origin.x;
    const localY = point.y - origin.y;
    const x = matrix[0][0] * localX + matrix[0][1] * localY;
    const y = matrix[1][0] * localX + matrix[1][1] * localY;
    transformedPoints.push({ x: x + origin.x, y: y + origin.y });
  }
  return transformedPoints;
};
const setKeyDown = (key: string) => (keysDown[key.charCodeAt(0)] = true);
const setKeyUp = (key: string) => (keysDown[key.charCodeAt(0)] = false);
const getKey = (key: string): boolean => keysDown[key.charCodeAt(0)];

// frame code
const update = () => {
  const scale = getKey("w") ? 1.05 : getKey("s") ? 0.95 : 1.0;
  const radians = getKey("a") ? -0.05 : getKey("d") ? 0.05 : 0.0;
  const scaleMatrix = getScaleMatrix(scale);
  const rotationMatrix = getRotationMatrix(radians);
  const m = multiplyMatrices(scaleMatrix, rotationMatrix);
  points = transformPoints(points, org, m);
};
const render = () => {
  ctx.clearRect(0, 0, canvasSize, canvasSize);
  ctx.strokeStyle = "#ddd";
  ctx.fillStyle = "#444";
  ctx.beginPath();

  for (const point of points) {
    ctx.lineTo(point.x * canvasSize, point.y * canvasSize);
  }

  ctx.closePath();
  ctx.stroke();
  ctx.fill();
};
const forever = () => {
  update();
  render();
  requestAnimationFrame(forever);
};
requestAnimationFrame(forever);

// events
window.addEventListener("keydown", (e: KeyboardEvent) => setKeyDown(e.key));
window.addEventListener("keyup", (e: KeyboardEvent) => setKeyUp(e.key));
