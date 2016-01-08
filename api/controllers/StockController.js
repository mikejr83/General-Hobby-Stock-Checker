'use strict';

var colors = require('colors');
var jsdom = require('jsdom');
var jquery = require('jquery');
var moment = require('moment');
var Q = require('q');

/**
 * ClassController
 *
 * @description :: Server-side logic for managing classes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

function buildData() {
  var deferred = Q.defer(),
    stock = [],
    processdCount = 0,
    processedPage = 1,
    baseUrl = 'http://www.generalhobby.com/airplanes-browse-airplane-c-21_37.html',
    totalAvailable = 0,
    jsonData = [],
    requestConfig = {
      url: baseUrl,
      scripts: null,
      done: function (errors, window) {
        var $ = jquery(window);

        var countText = $('DIV#main.col-main FORM TABLE.pager TBODY TD STRONG').text();
        var totalCount = parseInt(countText.substring(0, countText.length - 8), 10);

        var listingItems = $('DIV#main.col-main div.listing-item');

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

          if (item.regularPrice) {
            item.regularPrice = parseFloat(item.regularPrice.replace('$', ''));
          }

          if (item.specialPrice) {
            item.specialPrice = parseFloat(item.specialPrice.replace('$', ''));
          }

          stock.push(Stock.findOrCreate({
            pageUrl: item.pageUrl
          }, item));

          if ($('DIV.product-shop SPAN:contains("Sold Out")', this).length) {
            return;
          } else {
            item.soldOut = false;
            totalAvailable++;
          }
        });

        processdCount += listingItems.length;

        if (processdCount < totalCount) {
          var page = baseUrl + '?page=' + (++processedPage).toString() + '&sort=5a';

          deferred.notify('Parsing page: ' + page);

          requestConfig.url = page;


          jsdom.env(requestConfig);

        } else {
          console.log(stock.length);
          //          var i = 0;
          //          async.eachSeries(stock, function(sItem, callback) {
          //            console.log(++i);
          //            Stock.findOrCreate({pageUrl: sItem.pageUrl}, sItem, callback);
          //          }, function(err) {
          //            console.log('each done');
          //            deferred.resolve();
          //          });
          deferred.notify('Saving to DB...');
          Promise.all(stock).then(function () {
            deferred.resolve();
          }, function () {}, function () {
            console.log(arguments)
          });

        }
      }
    };

  jsdom.env(requestConfig);

  return deferred.promise;
}

module.exports = {
  build: function (request, response) {
    function doBuildData() {
      buildData().then(function () {
        console.log('finished!');
        response.json(null);
      }, function (error) {
        console.log('Oh no! An error:', error);
      }, function (notification) {
        console.log(notification);
      });
    };

    AppInfo.find().sort('lastModified desc').limit(1).then(function (result) {
      if (!result || result.length == 0) {
        AppInfo.create({
          lastModified: moment().utc().valueOf()
        }).then(function () {
          doBuildData();
        });
      } else {
        var lastModified = moment.utc(result.lastModified);
        if (moment.utc().diff(lastModified, 'days') >= 1) {
          doBuildData();
        } else {
          response.json(null);
        }
      }
    });


  },
  total: function (request, response) {
    var query = null;

    if (request.param('soldOut', null) === null) {
      query = Stock.count();
    } else {
      query = Stock.count({
        soldOut: false
      });
    }

    query.then(function (a) {
      response.json(a);
    });
  }
};
