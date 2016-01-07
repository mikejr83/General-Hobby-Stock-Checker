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
      type: 'string',
      required: true
    },
    regularPrice: {
      type: 'float'
    },
    specialPrice: {
      type: 'float'
    }
  }
};
