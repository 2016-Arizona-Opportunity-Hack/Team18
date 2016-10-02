'use strict';

let app = require('../app');
let express = require('express');
let pg_tool = require('../bin/pg_tool');
let aes_tool = require('../bin/aes_tool');
let redis_tool = require('../bin/redis_tool');
let session_tool = require('../bin/session_tool');
let validator_tool = require('../bin/validator_tool');
let checkInput = validator_tool.checkInput;
const email_re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

let router = express.Router();

router.get('/', function(req, res) {
  res.send('member works');
});

router.post('/', function(req, res) {
  if (req.body.first_name && req.body.last_name && req.body.phone && req.body.email && req.body.type && req.body.preference && req.body.interest) {
    try {
      let first_name = req.body.first_name + '';
      let last_name = req.body.last_name + '';
      let phone = req.body.phone + '';
      let email = req.body.email + '';
      let address = null;
      if (req.body.address) {
        address = req.body.address + '';
      }
      let company = null;
      if (req.body.company) {
        company = req.body.company + '';
      }
      let type = Number(req.body.type);
      let preference = Number(req.body.preference);
      let last_contacted = null;
      let interest = Number(req.body.interest);
      let comment = null;
      if (req.body.comment) {
        comment = req.body.comment + '';
      }
      let params = [first_name,last_name,phone,email,address,company,type,preference,last_contacted,interest,comment];
      pg_tool.query('INSERT INTO nv.member(first_name,last_name,phone,email,address,company,type_id,communication_preference_id,last_contacted,engagement_interest_id,comment) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)', params, function(error, rows) {
        if (error) {
          let result = {
            'status': 500,
            'message': 'Server Error'
          };
          res.send(result);
        }
        else {
          let result = {
            'status': 201,
            'message': 'Member Created'
          };
          res.send(result);
        }
      });
    }
    catch (err) {
      console.log(err);
      let result = {
        'status': 500,
        'message': 'Server Error'
      };
      res.send(result);
    }
  }
  else {
    let result = {
      'status': 400,
      'message': 'Invalid Parameters'
    };
    res.send(result);
  }
});

router.put('/', function(req, res) {
  res.send('it works');
});

router.delete('/', function(req, res) {
  res.send('it works');
});

router.get('/donation', function(req, res) {
  res.send('member donation works');
});

router.post('/donation', function(req, res) {
  res.send('it works');
});

router.put('/donation', function(req, res) {
  res.send('it works');
});

router.delete('/donation', function(req, res) {
  res.send('it works');
});

module.exports = router;
