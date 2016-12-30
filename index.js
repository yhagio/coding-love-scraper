const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

const titlesAndGifs = [];
const URL = 'http://thecodinglove.com/page';

// Number of pages you would like to get gifs of (4 gifs per page)
const numOfPages = typeof parseInt(process.argv[2], 10) === 'number'
? process.argv[2]
: 1;

for (let i = 1; numOfPages >= i; i++) {
  request(`${URL}/${i}`, (err, res, html) => {
    if (err) {
      console.log('[ERROR]\n', err);
      return;
    }
    const $ = cheerio.load(html);

    // Scrape the 'title' and 'gifs' of the funny shit!
    $('.bodytype').each(function(i, el) {
      const title = $(this).prev().text();
      const gif = $(this).children().children().first().attr('src');
      titlesAndGifs.push({ title, gif });
    });

    // Write each object of its title & gif to 'output.json' file
    fs.writeFileSync('output.json', JSON.stringify(titlesAndGifs, null, 2));
  });
}

console.log('DONE scraping. Check "output.json"');
