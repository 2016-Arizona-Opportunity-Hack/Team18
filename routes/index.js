'use strict';

let app = require('../app');
let express = require('express');
let knex = require('../bin/knex_tool').getKnex();
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
    res.render('home', { name: req.session.name });
  }
  else {
    res.render('login');
  }
});

router.post('/auth', function(req, res) {
  let pass_re = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9!@#$%^&*/._+-]{8,31})$/;
  if (checkInput(req.body.email, 'string', email_re) && checkInput(req.body.password, 'string', pass_re)) {
    let email = req.body.email + '';
    email = email.toLowerCase();
    knex('nv.admin').select().where(knex.raw('email = :email', {email:email})).asCallback((error, rows) => {
      if (error) {
        let result = {
          "status": 500,
          "message": 'Server Error'
        };
        res.send(result);
      }
      else {
        if (rows[0] && bcrypt.compareSync(req.body.password, rows[0].password)) {
          req.session.email = email;
          req.session.name = rows[0].first_name;
          req.session.type = rows[0].type;
          let result = {
            "status": 200,
            "message": 'Successfully Authenticated'
          };
          res.send(result);
        }
        else {
          let result = {
            "status": 200,
            "message": 'Invalid Email/Password'
          };
          res.send(result);
        }
      }
    });
  }
  else {
    let result = {
      "status": 400,
      "message": 'Invalid Email/Password'
    };
    res.send(result);
  }
});

router.delete('/session', function(req, res) {
  if (checkInput(req.session.email, 'string', email_re)) {
    req.session.destroy();
    let result = {
      "status": 200,
      "message": 'Session Deleted'
    };
    res.send(result);
  }
  else {
    let result = {
      "status": 401,
      "message": 'Unauthorized Request'
    };
    res.send(result);
  }
});

module.exports = router;
