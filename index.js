const express = require('express');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const app = express();

const PORT = process.env.PORT || 5000;

app.get('/scrape', (req, res, next) => {
  // scraping will happen here
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

module.export = app;
