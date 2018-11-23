const express = require('express');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const app = express();

const PORT = process.env.PORT || 5000;

app.get('/scrape', (req, res, next) => {
  const url = 'http://www.imdb.com/title/tt1229340/';

  const json = { title: '', release: '', rating: '' };

  request(url, (err, response, html) => {
    if (err) {
      console.log('ERROR: ' + err);

      return res.send(err);
    } else {
      const $ = cheerio.load(html);

      $('h1').filter(function () {
        const data = $(this);
        json.title = data.contents().first().text().trim();
      });

      $('#titleYear').filter(function () {
        const data = $(this);
        json.release = data.children().first().text().trim();
      });

      $(`.ratingValue`).filter(function () {
        const data = $(this);
        json.rating = data.text().trim();
      });
    }

    fs.writeFile('output.json', JSON.stringify(json, '', 2), (err) => {
      if (err) {
        console.log(`\nERROR!:\n${err}`);
      } else {
        console.log('File successfully written to \'output.json\'');
      }
    });

    // a message to a browser that tries to use this path
    return res.send('Check your console');
  }); // end of request
}); // end of get '/scrape'

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

module.export = app;
