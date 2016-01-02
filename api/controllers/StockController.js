'use strict';

var colors = require('colors');
var jsdom = require('jsdom');
var jquery = require('jquery');

var Q = require('q');

/**
 * ClassController
 *
 * @description :: Server-side logic for managing classes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  build: function (request, response) {
    var bigInfo = function () {},
      dumpJSONInfo = function () {
console.log(jsonData);
      },
      processdCount = 0,
      processedPage = 1,
      baseUrl = 'http://www.generalhobby.com/airplanes-browse-airplane-c-21_37.html',
      totalAvailable = 0,
      jsonData = [],
      requestConfig = {
        url: baseUrl,
        scripts: null,
        done: function (errors, window) {
          if (errors) {
            error(errors);
          }

          var $ = jquery(window);

          var countText = $('DIV#main.col-main FORM TABLE.pager TBODY TD STRONG').text();
          var totalCount = parseInt(countText.substring(0, countText.length - 8), 10);

          var listingItems = $('DIV#main.col-main div.listing-item');

//          log('Processing ' + listingItems.length + ' items');

          listingItems.each(function () {
            var itemText = $('DIV.product-shop H5 A:last-child', this).text();
            var pageUrl = $('DIV.product-image A', this).attr('href');
            var imageUrl = $('DIV.product-image A IMG', this).attr('src');

            var item = {
              name: itemText,
              soldOut: true,
              imageUrl: 'http://www.generalhobby.com/' + imageUrl,
              pageUrl: pageUrl,
              regularPrice: null,
              specialPrice: null
            };

            var regularPriceElement = $('.price-box .regular-price .price', this);
            var specialPriceElement = $('S', regularPriceElement);
            if (specialPriceElement.length) {
              item.regularPrice = specialPriceElement.text();
              item.specialPrice = $('.productSpecialPrice', regularPriceElement).text();
            } else {
              item.regularPrice = regularPriceElement.text();
            }

            Stock.create(item);
            //jsonData.push(item);

            if ($('DIV.product-shop SPAN:contains("Sold Out")', this).length) {
              return;
            } else {
              item.soldOut = false;
              totalAvailable++;
//              log(itemText);
            }
          });

          processdCount += listingItems.length;

          bigInfo('Completed processing of ' + processdCount + ' items!');

          if (processdCount < totalCount) {
            var page = baseUrl + '?page=' + (++processedPage).toString() + '&sort=5a';
//            log(page);
            requestConfig.url = page;

            jsdom.env(requestConfig);
          } else {
            dumpJSONInfo();
            bigInfo('Processed ' + totalAvailable + ' available items!');
          }
        }
      };

    jsdom.env(requestConfig);

    response.json({});
  },

  add: function (req, res) {
    var firebaseRef = new Firebase(sails.config.globals.firebaseUrl + 'classes'),
      params = req.body;
    console.log('class add', params);

    firebaseRef.push({
      name: params.className
    });

    return res.end();
  },
};
