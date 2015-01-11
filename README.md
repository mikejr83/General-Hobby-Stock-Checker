# GeneralHobby.com Stock Checker
Scrapes and downloads currently in stock items from www.GeneralHobby.com.

I built this because their website is not so fun to navigate and find in
 stock items. The node script goes to their 'all products' page and goes 
 through each page getting the product's name, a link to the details 
page, it's price (and discounted price), an image, and the stock status.

It takes ~20sec to run and is mainly constrained by network speed. 
Hopefully it isn't an unnecessary burden on their website!

## Installation
* Install Git, NodeJS, and Python 2.7.9 (or later; required for jsdom module)
* Install gulp and bower in global modules. ```npm install -g gulp bower```
* ```git clone https://github.com/mikejr83/General-Hobby-Stock-Checker.git```
* ```npm install && bower install && node index.js && gulp wiredep && gulp serve```

If any one of the commands in the chain fails then you will need to investigate each command individually.

Once the installation has setup the node environment and built the page it is only necessary to run ```node index.js``` to update the stock list.

Built using the Yeoman gulp-webapp generator. *generator-gulp-webapp*.
