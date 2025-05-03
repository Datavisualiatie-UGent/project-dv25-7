export function colorLegend({
  colorScale,
  title = "Count",
  width = 300,
  height = 10,
}) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");

  for (let i = 0; i < width; ++i) {
    context.fillStyle = colorScale(i / (width - 1));
    context.fillRect(i, 0, 1, height);
  }

  const legend = document.createElement("div");
  legend.style.display = "inline-block";
  legend.innerHTML = `<div style="font: 18px sans-serif; margin-bottom: 4px">${title}</div>`;
  legend.appendChild(canvas);

  // Add labels
  const labelContainer = document.createElement("div");
  labelContainer.style.display = "flex";
  labelContainer.style.justifyContent = "space-between";
  labelContainer.style.font = "10px sans-serif";
  labelContainer.innerHTML = `<div style="font: 18px sans-serif">Low</div><div style="font: 18px sans-serif">High</div>`;
  legend.appendChild(labelContainer);

  return legend;
}
