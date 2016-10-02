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
const name_re = /^(\w{3,63})$/;
const phone_re = /^(\+\d{1,2}){0,1}(\d|-|\(|\)){7,14}$/;

let router = express.Router();

router.get('/:id', function(req, res) {
  if (checkInput(req.session.email, 'string', email_re)) {
    if (checkInput(req.params.id, 'number', null)) {
      try {
        let id = Number(req.params.id);
        pg_tool.query('SELECT * FROM nv.member WHERE id=$1', [id], function(error, rows) {
          let result = {
            'status': 200,
            'member': rows[0],
            'message': 'Successfully accessed participant data'
          }
          res.send(result);
        });
      }
      catch (err) {
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

router.post('/', function(req, res) {
  if (checkInput(req.session.email, 'string', email_re)) {
    if (checkInput(req.body.first_name,'string',name_re) && checkInput(req.body.last_name,'string',name_re) && checkInput(req.body.phone,'string',phone_re) && checkInput(req.body.email,'string',email_re) && checkInput(req.body.type,'number',null) && checkInput(req.body.preference,'number',null) && checkInput(req.body.interest,'number',null)) {
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
    if (checkInput(req.body.id,'number',null) && checkInput(req.body.first_name,'string',name_re) && checkInput(req.body.last_name,'string',name_re) && checkInput(req.body.phone,'string',phone_re) && checkInput(req.body.email,'string',email_re) && checkInput(req.body.type,'number',null) && checkInput(req.body.preference,'number',null) && checkInput(req.body.interest,'number',null)) {
      try {
        let id = Number(req.body.id);
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
        let params = [first_name,last_name,phone,email,address,company,type,preference,last_contacted,interest,comment,id];
        pg_tool.query('UPDATE nv.member SET first_name=$1, last_name=$2, phone=$3, email=$4, address=$5, company=$6, type_id=$7, communication_preference_id=$8, last_contacted=$9, engagement_interest_id=$10, comment=$11 WHERE id=$12', params, function(error, rows) {
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
              'message': 'Member Updated'
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

module.exports = router;
