const express = require('express');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const app = express();

const PORT = process.env.PORT || 5000;

app.get('/scrape', (req, res, next) => {
  const url = 'http://www.imdb.com/title/tt1229340/';

  request(url, (err, res, html) => {
    if (!err) {
      const $ = cheerio.load(html);

      let title;
      let release;
      let rating;

      const json = { title: '', release: '', rating: '' };

      $('header').filter(() => {
        const data = $(this);

        title = data.children().first().text();

        json.title = title;

        release = data.children().last().children().text();

        json.release = release;
      });

      $('.star-box-giga-star').filter(() => {
        const data = $(this);

        rating = data.text();
        json.rating = rating;
      });

    }
  }); // end of request

  fs.writeFile('output.json', JSON.stringify(json, '', 2), (err) => {
    if (err) {
      console.log(`\nERROR!:\n${err}`);
    } else {
      console.log('File successfully written to \'output.json\'');
    }
  });

  // a message to a browser that tries to use this path
  return res.send('Check your console');

}); // end of get '/scrape'



app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

module.export = app;
