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
  if (checkInput(req.session.email, 'string', email_re)) {
    res.send('member works');
  }
  else {
    res.render('login')
  }
});

router.post('/', function(req, res) {
  if (checkInput(req.session.email, 'string', email_re)) {
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
  }
  else {
    let result = {
      'status': 401,
      'message': 'Unauthorized Request'
    };
    res.send(result);
  }
});

router.put('/', function(req, res) {
  if (checkInput(req.session.email, 'string', email_re)) {
    let result = {
      'status': 501,
      'message': 'Not Implemented'
    };
    res.send(result);
  }
  else {
    let result = {
      'status': 401,
      'message': 'Unauthorized Request'
    };
    res.send(result);
  }
});

router.delete('/', function(req, res) {
  if (checkInput(req.session.email, 'string', email_re) && req.session.type === 'super') {
    if (checkInput(req.body.member_id, 'number', null)) {
      try {
        let id = Number(req.body.member_id);
        pg_tool.query('DELETE FROM nv.member WHERE id=$1', [id], function(error, rows) {
          if (error) {
            let result = {
              'status': 500,
              'message': 'Server Error'
            };
            res.send(result);
          }
          else {
            let result = {
              'status': 200,
              'message': 'Member Deleted'
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
  }
  else {
    let result = {
      'status': 401,
      'message': 'Unauthorized Request'
    };
    res.send(result);
  }
});

router.get('/donation', function(req, res) {
  if (checkInput(req.session.email, 'string', email_re)) {
    res.send('it works');
  }
  else {
    let result = {
      'status': 401,
      'message': 'Unauthorized Request'
    };
    res.send(result);
  }
});

router.post('/donation', function(req, res) {
  if (checkInput(req.session.email, 'string', email_re)) {
    res.send('it works');
  }
  else {
    let result = {
      'status': 401,
      'message': 'Unauthorized Request'
    };
    res.send(result);
  }
});

router.put('/donation', function(req, res) {
  if (checkInput(req.session.email, 'string', email_re)) {
    res.send('it works');
  }
  else {
    let result = {
      'status': 401,
      'message': 'Unauthorized Request'
    };
    res.send(result);
  }
});

router.delete('/donation', function(req, res) {
  if (checkInput(req.session.email, 'string', email_re)) {
    res.send('it works');
  }
  else {
    let result = {
      'status': 401,
      'message': 'Unauthorized Request'
    };
    res.send(result);
  }
});

module.exports = router;
