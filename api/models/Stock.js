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
  execCallback: null,

  where: function (filter) {
    this.whereFilter = filter;
    return this;
  },

  limit: function (limitAmount) {
    this.firebaseRef = this.firebaseRef.limitToFirst(limitAmount);
    return this;
  },

  skip: function (skipAmount) {
    this.firebaseRef = this.firebaseRef.startAt(skipAmount);
    return this;
  },

  sort: function (sortExpression) {
    //this.sortExpression = sortExpression || 'name';
    this.firebaseRef = this.firebaseRef.orderByChild('name');
    return this;
  },

  exec: function (callback) {
    this.firebaseRef.on('value', function(snapshot){
      callback(null, snapshot.val());
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

  create: function (obj, callback) {
    this.createOrUpdate(obj, callback);
  },

  createOrUpdate: function (obj, callback) {
    var firebaseRef = new Firebase(sails.config.globals.firebaseUrl + 'stock');

    firebaseRef.orderByChild('pageUrl').equalTo(obj.pageUrl).on('value', function (firebaseResult) {
      var data = firebaseResult.val();

      if (!data) {
        // creating the data
        firebaseRef.push(obj);
      } else {
        // updating the data
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
//            for (var prop in obj) {
//              if (obj.hasOwnProperty(prop)) {
//                data[key][prop] = obj[prop];
//              }
//            }
            firebaseRef.child(key).set(obj);
          }

        }

//        firebaseRef.update(data);
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
