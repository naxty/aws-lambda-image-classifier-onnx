const test = require('tape');
const process = require("../lib/process");
const input = require("../lib/input");
const image2base64 = require('image-to-base64');
const inference = require('../lib/inference');

test('process test', function (t) {
    let x = new Uint8ClampedArray ([
        255, 255, 255, 1,
        255, 255, 255, 1
    ]);
    let processed_x = process(x, 1, 1);
    t.is(processed_x.length, 3);
    t.end();
});

test('base64 input', async(t) => {
    let img ="./test/cat.jpg";
    const base64String = await image2base64(img);
    let result = await input(base64String);
    t.is(result.data instanceof Uint8ClampedArray, true);
    t.end();
});

test('prediction', async(t) => {
    let imgPath ="./test/cat.jpg";
    const base64String = await image2base64(imgPath);
    let img = await input(base64String);
    let preprocessedData = await process(img.data, 224, 224);
    let predictions = await inference.predict(preprocessedData)    
    let output = await inference.formatOutput(predictions)
    
    let actualResult = output.map((value) => value['className']);
    let expected = [ 'Egyptian_cat', 'tabby', 'tiger_cat', 'horned_viper', 'sidewinder' ];
    t.deepEqual(actualResult, expected);
    t.end()
});

test('formatted output and imagenet clases', (t) => {
    let predictions = [0.8, 0.05, 0.15];
    inference.formatOutput(predictions).then(result => {
        let actual = result.map((value) => value['className']);
        let expected = ['tench', 'great_white_shark', 'goldfish'];
        t.deepEqual(actual, expected)
        t.end();
    });
});
