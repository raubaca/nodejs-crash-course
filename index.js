const fs = require('fs');
const http = require('http');
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const laptopData = JSON.parse(json);

const server = http.createServer((req, res) => {
  const pathName = url.parse(req.url, true).pathname;
  const id = url.parse(req.url, true).query.id;

  // PRODUCTS
  if (pathName === '/products' || pathName === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });

    fs.readFile(
      `${__dirname}/templates/template-overview.html`,
      'utf-8',
      (err, data) => {
        let overviewOutput = data;
        fs.readFile(
          `${__dirname}/templates/template-card.html`,
          'utf-8',
          (err, data) => {
            const cardsOutput = laptopData
              .map((laptop) => replaceTemplate(data, laptop))
              .join('');
            overviewOutput = overviewOutput.replace('{%CARDS%}', cardsOutput);

            res.end(overviewOutput);
          }
        );
      }
    );
  }

  // LAPTOP DETAIL
  else if (pathName === '/laptop' && id < laptopData.length) {
    res.writeHead(200, { 'Content-Type': 'text/html' });

    fs.readFile(
      `${__dirname}/templates/template-laptop.html`,
      'utf-8',
      (err, data) => {
        const laptop = laptopData[id];
        const output = replaceTemplate(data, laptop);
        res.end(output);
      }
    );
  }

  // IMAGES
  else if (/\.(jpg|jpeg|png|gif)$/i.test(pathName)) {
    fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
      if (err) console.log(err);
      res.writeHead(200, { 'Content-Type': 'image/jpg' });
      res.end(data);
    });
  }

  // NOT FOUND
  else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('Invalid URL');
  }
});

server.listen(1337, '127.0.0.1', () => {
  console.log('Listening for requuest now');
});

const replaceTemplate = (html, laptop) => {
  let output = html
    .replace(/{%PRODUCTNAME%}/g, laptop.productName)
    .replace(/{%IMAGE%}/g, laptop.image)
    .replace(/{%PRICE%}/g, laptop.price)
    .replace(/{%SCREEN%}/g, laptop.screen)
    .replace(/{%CPU%}/g, laptop.cpu)
    .replace(/{%STORAGE%}/g, laptop.storage)
    .replace(/{%RAM%}/g, laptop.ram)
    .replace(/{%DESCRIPTION%}/g, laptop.description)
    .replace(/{%ID%}/g, laptop.id);
  return output;
};
