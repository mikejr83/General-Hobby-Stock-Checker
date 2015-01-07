var colors = require('colors');
var jsdom = require('jsdom');
var jquery = require('jQuery');
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

var $DASH = '--------------------------------------------------------------------------------';

var log = function(message) {
	if(message)
		console.log(message.toString().info);
};

var error = function(message) {
	if (message)
		console.error(message.toString().error);
};

var warn = function(message) {
	if (message)
		console.warn(message.toString().warn);
};

var bigInfo = function(message) {
	message = '\n' + $DASH + '\n' + message + '\n' + $DASH + '\n';
	log(message);
};

var $PROCESSED_COUNT = 0;
var $PROCESSED_PAGE = 1;
var $BASE_URL = 'http://www.generalhobby.com/airplanes-browse-airplane-c-21_37.html';
var $TOTAL_AVAILABLE = 0;
var $JSON_DATA = [];

var dumpJSONInfo = function() {
	fs.writeFile('app/scripts/data.json', 'var $DATA = ' + JSON.stringify($JSON_DATA, null, 4) + ';', function(e) {
		if (e)
			error(e);
		else
			log('Data saved!');
	});
};

var $CONFIG = {
	url: $BASE_URL,
	scripts: null,
	done: function(errors, window) {
		if (errors)
			error(errors);
			
		var $ = jquery(window);
		
		var countText = $('DIV#main.col-main FORM TABLE.pager TBODY TD STRONG').text();
		var totalCount = parseInt(countText.substring(0, countText.length - 8), 10);
		
		var listingItems = $('DIV#main.col-main div.listing-item');
		
		log('Processing ' + listingItems.length + ' items');
		
		listingItems.each(function(listingItem) {
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
			
			$JSON_DATA.push(item);
			
			if ($('DIV.product-shop SPAN:contains("Sold Out")', this).length) {
				return;
			}
			else {
				item.soldOut = false;
				$TOTAL_AVAILABLE++;
				log(itemText);
			}
		});
		
		$PROCESSED_COUNT += listingItems.length;
		
		bigInfo('Completed processing of ' + $PROCESSED_COUNT + ' items!');
		
		if ($PROCESSED_COUNT < totalCount) {
			var page = $BASE_URL + '?page=' + (++$PROCESSED_PAGE).toString() + '&sort=5a';
			log(page);
			$CONFIG.url = page;
			
			jsdom.env($CONFIG);
		}
		else {
			dumpJSONInfo();
			bigInfo('Processed ' + $TOTAL_AVAILABLE + ' available items!');
		}
	}
}

jsdom.env($CONFIG);
