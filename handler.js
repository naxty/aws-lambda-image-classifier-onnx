'use strict';
const input = require("./lib/input");
const process = require("./lib/process");
const inference = require('./lib/inference');

module.exports.predict = async (event) => {
  let body = JSON.parse(event.body);
  let base64String = body.image;
  let img = await input(base64String);
  let preprocessedData = await process(img.data, 224, 224);
  let predictions = await inference.predict(preprocessedData)    
  let output = await inference.formatOutput(predictions)
  return {
    statusCode: 200,
    body: JSON.stringify({output
    }, null, 2),
  };
};
