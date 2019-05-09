const ndarray = require("ndarray");
const ops = require("ndarray-ops");

function preprocess(data, width, height) {
  
  const dataFromImage = ndarray(new Float32Array(data), [width, height, 4]);
  // Normalize 0-255 to [0, 1]
  ops.divseq(dataFromImage, 255);
  
  ops.subseq(dataFromImage.pick(0, null, null), 0.485);
  ops.divseq(dataFromImage.pick(0, null, null), 0.229);
  
  ops.subseq(dataFromImage.pick(1, null, null), 0.456);
  ops.divseq(dataFromImage.pick(1, null, null), 0.224);
  
  ops.subseq(dataFromImage.pick(2, null, null), 0.406);
  ops.divseq(dataFromImage.pick(2, null, null), 0.225);
  
  // Realign imageData from [224*224*4] to the correct dimension [1*3*224*224].
  const dataProcessed = ndarray(new Float32Array(width * height * 3), [1, 3, height, width]);
  ops.assign(dataProcessed.pick(0, 0, null, null), dataFromImage.pick(null, null, 0));
  ops.assign(dataProcessed.pick(0, 1, null, null), dataFromImage.pick(null, null, 1));
  ops.assign(dataProcessed.pick(0, 2, null, null), dataFromImage.pick(null, null, 2));
  return dataProcessed.data;
}

module.exports = preprocess;
