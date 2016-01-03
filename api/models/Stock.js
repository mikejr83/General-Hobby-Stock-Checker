var Firebase = require("firebase");

/**
 * Stock.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var StockRequest = function () {};
StockRequest.prototype = {
  firebaseRef: new Firebase(sails.config.globals.firebaseUrl).child('stock'),
  whereFilter: null,
  limitAmount: 30,
  skipAmount: 0,
  sortExpression: null,
  sortDesc: false,
  execCallback: null,

  where: function (filter) {
    this.whereFilter = filter;
    return this;
  },

  limit: function (limitAmount) {
    //this.firebaseRef = this.firebaseRef.limitToFirst(limitAmount);
    this.limitAmount = limitAmount;

    return this;
  },

  skip: function (skipAmount) {
    //    this.firebaseRef = this.firebaseRef.startAt(skipAmount);
    this.skipAmount = skipAmount;
    return this;
  },

  sort: function (sortExpression) {
    //    this.sortExpression = sortExpression || 'name';
    if (sortExpression) {
      var split = sortExpression.split(' ');
      //this.firebaseRef = this.firebaseRef.orderByChild(split[0] || 'name');
      this.sortExpression = split[0] || 'name';
      if (split && split.length >= 2) {
        this.sortDesc = split[1].toLowerCase().indexOf('desc') === 0;
      }
    } else {
      //    this.firebaseRef = this.firebaseRef.orderByChild('name');
      this.sortExpression = 'name';
    }

    return this;
  },

  exec: function (callback) {
    var firebaseRef = new Firebase(sails.config.globals.firebaseUrl).child('stock');

    if (this.sortDesc) {
      firebaseRef = firebaseRef
        .orderByChild(this.sortExpression)
        .limitToLast(this.limitAmount + this.skipAmount);
    } else {
      firebaseRef = firebaseRef
        .orderByChild(this.sortExpression)
        .limitToFirst(this.limitAmount + this.skipAmount);

      if (this.skipAmount > 0) {
        firebaseRef = firebaseRef.startAt(this.skipAmount);
      }
    }

    var sortDesc = this.sortDesc,
      limitAmount = this.limitAmount,
      skipAmount = this.skipAmount;
    firebaseRef.once('value', function (snapshot) {
      var results = [],
        count = 0;

      if (sortDesc) {
        snapshot.forEach(function (childSnapshot) {
          if (count++ < limitAmount) {
            results.push(childSnapshot.val());
          }
        });
      } else {
        snapshot.forEach(function (childSnapshot) {
          if (count++ >= skipAmount) {
            results.push(childSnapshot.val());
          }
        });
      }

      callback(null, results);
    });
  }
};


module.exports = {

  attributes: {
    name: {
      type: 'string',
      required: true
    },
    soldOut: {
      type: 'boolean',
      required: true
    },
    imageUrl: {
      type: 'string',
      required: true
    },
    pageUrl: {
      type: 'boolean',
      required: true
    },
    regularPrice: {
      type: 'float',
      required: true
    },
    specialPrice: {
      type: 'float',
      required: true
    }
  },

  count: function (callback) {
    var firebaseRef = new Firebase(sails.config.globals.firebaseUrl + 'stock');

    firebaseRef.on('value', function (firebaseResult) {
      if (callback && typeof callback === 'function') {
        callback(firebaseResult.numChildren());
      }
    });
  },

  create: function (obj, callback) {
    var firebaseRef = new Firebase(sails.config.globals.firebaseUrl + 'stock');

    firebaseRef.orderByChild('pageUrl').equalTo(obj.pageUrl).on('value', function (firebaseResult) {
      var data = firebaseResult.val();

      if (!data) {
        // creating the data
        firebaseRef.push(obj);
      }

      if (callback) {
        callback(obj);
      }


    });
  },

  find: function () {
    return new StockRequest();
  }
};
