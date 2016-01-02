var Firebase = require("firebase");

/**
 * Stock.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    lastModified: {
      type: 'datetime',
      required: true
    }
  },

  update: function (id, obj, callback) {
    new Firebase(sails.config.globals.firebaseUrl).update({
      lastModified: obj.lastModified
    });
  }
};
