var Firebase = require("firebase");

/**
 * Stock.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

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
      type: 'string',
      required: true
    },
    specialPrice: {
      type: 'string',
      required: true
    }
  },

  create: function (obj, callback) {
    this.createOrUpdate(obj, callback);
  },

  createOrUpdate: function(obj, callback) {
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
            for (var prop in obj) {
              if(obj.hasOwnProperty(prop)){
                data[key][prop] = obj[prop];
              }
            }
          }
        }

        firebaseRef.update(data);
      }

      if (callback) {
        callback(obj);
      }


    });
  }
};
