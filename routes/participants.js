'use strict';

let app = require('../app');
let express = require('express');
let pg_tool = require('../bin/pg_tool');
let aes_tool = require('../bin/aes_tool');
let bcrypt = require('bcrypt-nodejs');
let redis_tool = require('../bin/redis_tool');
let session_tool = require('../bin/session_tool');
let validator_tool = require('../bin/validator_tool');
let checkInput = validator_tool.checkInput;
const email_re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

let router = express.Router();

router.get('/', function(req, res) {
  if (checkInput(req.session.email, 'string', email_re)) {
    res.render('participants', { name: req.session.name });
  }
  else {
    res.render('login');
  }
});

router.get('/all', function(req, res) {
  if (checkInput(req.session.email, 'string', email_re)) {
    try {
      pg_tool.query('SELECT * FROM nv.member WHERE type_id=2', [], function(error, rows) {
        if (error) {
          let result = {
            'status': 500,
            'message': 'Server Error'
          }
          res.send(result);
        }
        else {
          let result = {
            'status': 200,
            'participants': rows,
            'message': 'Successfully accessed participants\' data'
          }
          res.send(result);
        }
      });
    }
    catch (err) {
      console.log(err);
      let result = {
        'status': 500,
        'message': 'Server Error'
      }
      res.send(result);
    }
  }
  else {
    let result = {
      'status': 401,
      'message': 'Unauthorized Request'
    }
    res.send(result);
  }
});

module.exports = router;
