require('onnxjs');

const imagenet = require('./imagenet');

async function formatOutput(probabilities, n=5){
    let arr  = Array.from(probabilities);
    let indices = arr.map((k, v) => [k, v]);
    const sortedIndices = indices.sort((a,b) => {
        if(a[0] < b[0]){
            return -1;
        }
        if(a[0] > b[0]){
            return 1;
        }
        return 0;
    }).reverse().slice(0, n);
    const topN = sortedIndices.map((k, v) => {
        return {
            'prob': k[0],
            'className': imagenet[parseInt(k[1])][1]
        }
    });
    return topN
}

async function predict(preprocessedData, modelWidth=224, modelHeight=224){
    const session = new onnx.InferenceSession();
    await session.loadModel("./model/resnet.onnx");
    const inputTensor = new onnx.Tensor(preprocessedData, 'float32', [1, 3, modelWidth, modelHeight]);
    const classProbabilities = await session.run([inputTensor]);
    const outputData = classProbabilities.values().next().value.data;
    return outputData;
}

module.exports ={
    formatOutput, predict
}