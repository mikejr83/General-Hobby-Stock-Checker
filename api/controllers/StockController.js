'use strict';

var colors = require('colors');
var jsdom = require('jsdom');
var jquery = require('jquery');
var Firebase = require("firebase");
var moment = require('moment');
var Q = require('q');

/**
 * ClassController
 *
 * @description :: Server-side logic for managing classes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

function buildData() {
  var processdCount = 0,
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

          Stock.create(item);

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

          requestConfig.url = page;

          jsdom.env(requestConfig);
        }
      }
    };

  jsdom.env(requestConfig);
}

function clearData(callback) {
  var firebaseRef = new Firebase(sails.config.globals.firebaseUrl + 'stock');
  firebaseRef.remove(callback);
}

module.exports = {
  build: function (request, response) {
    var firebaseRef = new Firebase(sails.config.globals.firebaseUrl + 'lastModified');

    firebaseRef.once('value', function (dataSnapshot) {
      var lastModified = dataSnapshot.val();
      console.log('lastModified', lastModified);
      if (!lastModified) {
        clearData(function () {
          buildData();
        });

        AppInfo.update(null, {
          lastModified: moment().unix()
        });
      } else {
        var nextGet = moment.unix(lastModified);
        nextGet.add(1, 'days');

        if (moment().unix() > nextGet.unix()) {
          console.log('updating', moment().unix(), nextGet.unix());
          clearData(function () {
            buildData();
          });
          AppInfo.update(null, {
            lastModified: moment().unix()
          });
        } else {
          console.log('nope')
        }
      }

      response.json(null);
    });


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

  //  find: function() {
  //    console.log('arg', arguments[0]);
  //  }
};
