'use strict';

let app = require('../app');
let express = require('express');
let pg_tool = require('../bin/pg_tool');
let aes_tool = require('../bin/aes_tool');
let redis_tool = require('../bin/redis_tool');
let session_tool = require('../bin/session_tool');
let validator_tool = require('../bin/validator_tool');
let checkInput = validator_tool.checkInput;
let request = require('request');
const captcha_key = require('../bin/secret_settings').api_settings.captcha_key;
const name_re = /^(\w{3,63})$/;
const phone_re = /^(\+\d{1,2}){0,1}(\d|-|\(|\)){7,14}$/;
const email_re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

let router = express.Router();

router.get('/', function(req, res) {
  if (checkInput(req.session.email, 'string', email_re)) {
    res.render('home', { name: req.session.name });
  }
  else {
    res.render('register');
  }
});

function checkCaptcha(captcha_response, ip, callback) {
  try {
    let captchaData = {
      secret: captcha_key,
      response: captcha_response,
      remoteip: ip
    };
    let captcha_url = 'https://www.google.com/recaptcha/api/siteverify';
    request.post({
      url: captcha_url,
      form: captchaData
    },
    function(err, httpResponse, captcha_body) {
      if (err) {
        callback(false);
      }
      else {
        captcha_body = JSON.parse(captcha_body);
        if (captcha_body.success === true) {
          callback(true);
        }
        else {
          callback(false);
        }
      }
    });
  }
  catch (err) {
    console.log(err);
    callback(false);
  }
}

router.get('/preferences', function (req, res) {
  try {
    pg_tool.query('SELECT id, name FROM nv.communication_preference', [], function(error, rows) {
      let result = {
        'status': 200,
        'preferences': rows
      }
      res.send(result);
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
});

router.get('/interests', function (req, res) {
  try {
    pg_tool.query('SELECT id, name FROM nv.engagement_interest', [], function(error, rows) {
      let result = {
        'status': 200,
        'interests': rows
      }
      res.send(result);
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
});

router.post('/', function(req, res) {
  if (checkInput(req.body.first_name,'string',name_re) && checkInput(req.body.last_name,'string',name_re) && checkInput(req.body.phone,'string',phone_re) && checkInput(req.body.email,'string',email_re) && checkInput(req.body.preference,'number',null) && checkInput(req.body.interest,'number',null) && req.body.captcha_response) {
    try {
      checkCaptcha(req.body.captcha_response, req.connection.remoteAddress, function(captcha_result) {
        if (captcha_result === true) {
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
          let type = 3; //TODO: participant type
          let preference = Number(req.body.preference);
          let last_contacted = null;
          let interest = Number(req.body.interest);
          let comment = null;
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
                'message': 'Successfully Registered'
              };
              res.send(result);
            }
          });
        }
        else {
          let result = {
            'status': 403,
            'message': 'Invalid Captcha'
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

module.exports = router;
