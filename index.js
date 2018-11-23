const express = require('express');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const app = express();

const PORT = process.env.PORT || 5000;

app.get('/scrape/:titleNum', (req, res, next) => {
  const baseUrl = 'http://www.imdb.com/title/';
  const { titleNum } = req.params;
  const url = baseUrl + titleNum;

  const output = { title: '', release: '', rating: '' };

  request(url, (err, response, html) => {
    if (err) {
      console.log('ERROR: ' + err);

      return res.send(err);
    } else {
      const $ = cheerio.load(html);

      $('h1').filter(function () {
        const data = $(this);
        output.title = data.contents().first().text().trim();
      });

      $('#titleYear').filter(function () {
        const data = $(this);
        output.release = data.children().first().text().trim();
      });

      $(`.ratingValue`).filter(function () {
        const data = $(this);
        output.rating = data.text().trim();
      });
    }

    fs.writeFile(`output/${titleNum}.json`, JSON.stringify(output, '', 2), (err) => {
      if (err) {
        console.log(`\nERROR!:\n${err}`);
      } else {
        console.log(`File successfully written to '${titleNum}.json'`);
      }
    });

    // a message to a browser that tries to use this path
    return res.json(output);
  }); // end of request
}); // end of get '/scrape'

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
