"use strict";
// state
const org = { x: 0.5, y: 0.5 };
let points = [
    { x: 0.5, y: 0.25 },
    { x: 0.25, y: 0.5 },
    { x: 0.5, y: 0.75 },
    { x: 0.75, y: 0.5 },
];
const keysDown = { w: false, a: false, s: false, d: false };
// init
const canvasSize = 600;
const canvasEl = document.createElement("canvas");
canvasEl.width = canvasSize;
canvasEl.height = canvasSize;
canvasEl.style.width = `${canvasSize}px`;
document.body.appendChild(canvasEl);
const ctxOrNull = canvasEl.getContext("2d");
if (ctxOrNull === null)
    throw new Error("Could not get canvas context");
const ctx = ctxOrNull;
// helpers
const getScaleMatrix = (scale) => [
    [scale, 0, 0],
    [0, scale, 0],
    [0, 0, 1],
];
const getRotationMatrix = (radians) => [
    [Math.cos(radians), -Math.sin(radians), 0],
    [Math.sin(radians), Math.cos(radians), 0],
    [0, 0, 1],
];
const multiplyMatrices = (m1, m2) => {
    const result = new Array(3).fill(0).map(() => new Array(3).fill(0));
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            for (let i = 0; i < 3; i++) {
                result[row][col] += m1[row][i] * m2[i][col];
            }
        }
    }
    return result;
};
const transformPoints = (points, origin, matrix) => {
    const transformedPoints = [];
    for (const point of points) {
        const localX = point.x - origin.x;
        const localY = point.y - origin.y;
        const x = matrix[0][0] * localX + matrix[0][1] * localY + matrix[0][2];
        const y = matrix[1][0] * localX + matrix[1][1] * localY + matrix[1][2];
        transformedPoints.push({ x: x + origin.x, y: y + origin.y });
    }
    return transformedPoints;
};
// frame code
const update = () => {
    const scale = keysDown.w ? 1.05 : keysDown.s ? 0.95 : 1.0;
    const radians = keysDown.a ? -0.05 : keysDown.d ? 0.05 : 0.0;
    const scaleMatrix = getScaleMatrix(scale);
    const rotationMatrix = getRotationMatrix(radians);
    const m = multiplyMatrices(scaleMatrix, rotationMatrix);
    points = transformPoints(points, org, m);
};
const render = () => {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    ctx.strokeStyle = "black";
    ctx.fillStyle = "lightgray";
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
window.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "w":
            keysDown.w = true;
            break;
        case "s":
            keysDown.s = true;
            break;
        case "a":
            keysDown.a = true;
            break;
        case "d":
            keysDown.d = true;
            break;
    }
});
window.addEventListener("keyup", (e) => {
    switch (e.key) {
        case "w":
            keysDown.w = false;
            break;
        case "s":
            keysDown.s = false;
            break;
        case "a":
            keysDown.a = false;
            break;
        case "d":
            keysDown.d = false;
            break;
    }
});
