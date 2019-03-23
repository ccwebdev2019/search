// import mongoose model
import Website from "../models/Website";
// import express for creating our routes
import express from "express";
// import cheerio for serverside jquery for our scraping clean up
import cheerio from "cheerio";
// import request for crawling/scraping websites
import request from "request";
// helper functions for our scraping
import { getAnchors, getHtmlText, getTitle } from "../common/helper";
// create router const for creating our routes
const router = express.Router();

/**
 * Http Post request for indexing url
 * This route will receive a body { url: value }, value will be extracted and used in the request function
 * Then we will get back the page DOM and clean it up and save it to MongoDB
 */

router.post("/index", (req, res, next) => {
  if (req.body.url) {
    const url = req.body.url;
    let pages = [];
    // crawl first url
    request(url, (error, response, html) => {
      if (!error && response.statusCode === 200) {
        // load html to cheerio so we can use jquery
        const $ = cheerio.load(html);
        // get the anchor hrefs from url
        const hrefs = getAnchors($, "html", "a");
        // get title from url
        const title = getTitle($, "html", "title");
        // get text from html and clean it up
        const data = getHtmlText($, "html");
        pages.push({ url, title, data });
        // crawl first link found in first url
        let secondUrl =
          hrefs[0].indexOf("http") > -1 ? hrefs[0] : `${url}${hrefs[0]}`;
        request(secondUrl, (error, response, html) => {
          if (!error && response.statusCode === 200) {
            // load html to cheerio so we can use jquery
            const $ = cheerio.load(html);
            // get title from url
            const title = getTitle($, "html", "title");
            // get text from html and clean it up
            const data = getHtmlText($, "html");
            pages.push({ title, data, url: secondUrl });
            // crawl second link found in first url
            let thirdUrl =
              hrefs[1].indexOf("http") > -1 ? hrefs[1] : `${url}${hrefs[1]}`;
            request(thirdUrl, (error, response, html) => {
              if (!error && response.statusCode === 200) {
                const $ = cheerio.load(html);
                // get title from url
                const title = getTitle($, "html", "title");
                // get text from html and clean it up
                const data = getHtmlText($, "html");
                pages.push({ title, data, url: thirdUrl });
                Website.insertMany(pages, (error, data) => {
                  if (error) {
                    return next(error);
                  }
                  return res.status(200).send(data);
                });
              }
            });
          }
        });
      }
    });
  }
});

/**
 * Http Post for searching a key word
 * This route will receive body { search: value }
 * We will do an index seaarch with $text $search so we can send back the correct documents and sorted out correctly
 */
router.post("/search", (req, res) => {
  if (req.body.search) {
    Website.find(
      { $text: { $search: req.body.search } },
      { score: { $meta: "textScore" } },
      (error, data) => {
        if (error) {
          return next(error);
        } else {
          return res
            .status(200)
            .send({ data, searchWord: req.body.search, success: true });
        }
      }
    ).sort({ score: { $meta: "textScore" } }); // sort from highest scored to lowest scored
  } else {
    res
      .status(400)
      .send({ success: false, message: "we need a word in order to search" });
  }
});

// get all documents
router.get("/all", (req, res) => {
  Website.find({}, (error, data) => {
    if (error) {
      return next(error);
    }
    return res.status(200).send(data);
  });
});

export default router;
