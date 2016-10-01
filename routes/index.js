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
const uname_re = /^(\w{3,63})$/;

let router = express.Router();

router.get('/', function(req, res) {
  if (checkInput(req.session.uname, 'string', uname_re)) {
    res.render('home');
  }
  else {
    res.render('login');
  }
});

router.post('/auth', function(req, res) {
  let pass_re = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9!@#$%^&*/._+-]{8,31})$/;
  if (checkInput(req.body.username, 'string', uname_re) && checkInput(req.body.password, 'string', pass_re)) {
    let user = req.body.username + '';
    user = user.toLowerCase();
    pg_tool.query('SELECT password, type FROM nv.admin WHERE username=$1', [user], function(error, rows) {
      if (error) {
        let result = {
          "status": 500,
          "error": 'Server Error'
        };
        res.send(result);
      }
      else {
        if (rows[0] && bcrypt.compareSync(req.body.password, rows[0].password)) {
          req.session.uname = user;
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
            "message": 'Invalid Username/Password'
          };
          res.send(result);
        }
      }
    });
  }
  else {
    let result = {
      "status": 400,
      "message": 'Invalid Username/Password'
    };
    res.send(result);
  }
});

router.delete('/session', function(req, res) {
  if (checkInput(req.session.uname, 'string', uname_re)) {
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
