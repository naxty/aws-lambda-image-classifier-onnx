const { createCanvas, loadImage } = require('canvas')
const fs = require("fs");
const util = require('util');
const writeFile = util.promisify(fs.writeFile);

async function base64ToImg(b64string){
    const binaryData = Buffer.from(b64string, 'base64').toString('binary');
    const imgUrl = "/tmp/out.jpg"
    await writeFile(imgUrl, binaryData, "binary");
    return imgUrl;
}

async function getImageData(url, modelWidth, modelHeight) {
    let canvas = createCanvas(modelWidth, modelHeight);
    let ctx = canvas.getContext('2d');
    await loadImage(url).then((image) => {
        ctx.drawImage(image, 0, 0)
    })   
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    return imageData;
};

module.exports = async(base64string, modelWidth=224, modelHeight=224) => {
    let imgUrl = await base64ToImg(base64string);
    return await getImageData(imgUrl, modelWidth, modelHeight)
}
