'use strict';

var colors = require('colors');
var jsdom = require('jsdom');
var jquery = require('jquery');
var fs = require('fs');

colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});

var $Dashes = '--------------------------------------------------------------------------------';

var log = function(message) {
	if(message) {
		console.log(message.toString().info);
	}
};

var error = function(message) {
	if (message) {
		console.error(message.toString().error);
	}
};

/*
var warn = function(message) {
	if (message) {
		console.warn(message.toString().warn); //jshint ignore:line
	}
};
*/

var bigInfo = function(message) {
	message = '\n' + $Dashes + '\n' + message + '\n' + $Dashes + '\n';
	log(message);
};

var $ProcessedCount = 0;
var $ProcessedPage = 1;
var $BaseURL = 'http://www.generalhobby.com/airplanes-browse-airplane-c-21_37.html';
var $TotalAvailable = 0;
var $JSONData = [];

var dumpJSONInfo = function() {
	var jsonData = {
		date: new Date(),
		products: $JSONData
	};
	
	fs.writeFile('app/scripts/data.json', 'var $DATA = ' + JSON.stringify(jsonData, null, 4) + ';', function(e) {
		if (e) {
			error(e);
		}
		else {
			log('Data saved!');
		}
	});
};

var $Config = {
	url: $BaseURL,
	scripts: null,
	done: function(errors, window) {
		if (errors) {
			error(errors);
		}
			
		var $ = jquery(window);
		
		var countText = $('DIV#main.col-main FORM TABLE.pager TBODY TD STRONG').text();
		var totalCount = parseInt(countText.substring(0, countText.length - 8), 10);
		
		var listingItems = $('DIV#main.col-main div.listing-item');
		
		log('Processing ' + listingItems.length + ' items');
		
		listingItems.each(function() {
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
			}
			else {
				item.regularPrice = regularPriceElement.text();
			}			
			
			$JSONData.push(item);
			
			if ($('DIV.product-shop SPAN:contains("Sold Out")', this).length) {
				return;
			}
			else {
				item.soldOut = false;
				$TotalAvailable++;
				log(itemText);
			}
		});
		
		$ProcessedCount += listingItems.length;
		
		bigInfo('Completed processing of ' + $ProcessedCount + ' items!');
		
		if ($ProcessedCount < totalCount) {
			var page = $BaseURL + '?page=' + (++$ProcessedPage).toString() + '&sort=5a';
			log(page);
			$Config.url = page;
			
			jsdom.env($Config);
		}
		else {
			dumpJSONInfo();
			bigInfo('Processed ' + $TotalAvailable + ' available items!');
		}
	}
};

jsdom.env($Config);
