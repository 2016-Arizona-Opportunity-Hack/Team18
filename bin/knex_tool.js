'use strict';

const dbConfig = require('../knexfile.js');
let knex;

const start = function () {
    knex = require('knex')(dbConfig);
};

const getKnex = function () {
    return knex;
};

module.exports.start = start;
module.exports.getKnex = getKnex;
