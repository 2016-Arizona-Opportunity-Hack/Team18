'use strict';

let app = require('../app');
let express = require('express');
let knex = require('../bin/knex_tool').getKnex();
let aes_tool = require('../bin/aes_tool');
let redis_tool = require('../bin/redis_tool');
let session_tool = require('../bin/session_tool');
let validator_tool = require('../bin/validator_tool');
let checkInput = validator_tool.checkInput;
const email_re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const name_re = /^(\w{3,63})$/;
const date_re = /^\d{4}-\d{2}-\d{2}$/;

let router = express.Router();

router.get('/', function(req, res) {
  if (checkInput(req.session.email, 'string', email_re)) {
    res.render('donations');
  }
  else {
    res.render('login');
  }
});


router.get('/donors', function(req, res) {
  if (checkInput(req.session.email, 'string', email_re)) {
    try {
      knex('nv.member').where(knex.raw(
        'type_id = :type_id',
        { 'type_id': 2 }
      )).asCallback((error, rows) => {
        let result = {
          'status': 200,
          'donors': rows
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
      'status': 401,
      'message': 'Unauthorized Request'
    };
    res.send(result);
  }
});

router.get('/types', function(req, res) {
  if (checkInput(req.session.email, 'string', email_re)) {
    try {
      knex('nv.donation_type').select('id, name').asCallback((error, rows) => {
        let result = {
          'status': 200,
          'types': rows
        };
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
      'status': 401,
      'message': 'Unauthorized Request'
    };
    res.send(result);
  }
});

router.get('/methods', function(req, res) {
  if (checkInput(req.session.email, 'string', email_re)) {
    try {
      knex('nv.donation_method').select('id, name').asCallback((error, rows) => {
        let result = {
          'status': 200,
          'methods': rows
        };
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
      'status': 401,
      'message': 'Unauthorized Request'
    };
    res.send(result);
  }
});

router.get('/:id', function(req, res) {
  if (checkInput(req.session.email, 'string', email_re)) {
    if (checkInput(req.params.id, 'number', null)) {
      try {
        let id = Number(req.params.id);
        knex('nv.donation').where(knex.raw('id = :id', {id: id})).asCallback((error, rows) => {
          let result = {
            'status': 200,
            'donation': rows
          };
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
    if (checkInput(req.body.amount,'number',null) && checkInput(req.body.donor,'number',null) && checkInput(req.body.date,'string',date_re) && checkInput(req.body.frequency,'string',name_re) && checkInput(req.body.method,'number',null) && checkInput(req.body.type,'number',null)) {
      try {
        let amount = Number(req.body.amount);
        let donor = Number(req.body.donor);
        let date = req.body.date + '';
        let frequency = req.body.frequency;
        let method = Number(req.body.method);
        let type = Number(req.body.type);
        let comment = null;
        if (req.body.comment) {
          comment = req.body.comment + '';
        }
        let params = [amount,donor,date,frequency,method,type,comment];
        knex('nv.donation').insert(knex.raw('(amount,donor_id,date,frequency,method_id,type_id,comment) VALUES' +
            '(:amount,:donor_id,:date,:frequency,:method_id,:type_id,:comment)', {
            amount: amount,
            donor_id: donor_id,
            frequency: frequency,
            method_id: method_id,
            type_id: type_id,
            comment: comment
          })).asCallback((error, rows) => {
            if (error) {
              console.log(error);
              let result = {
                'status': 500,
                'message': 'Server Error'
              };
              res.send(result);
            }
            else {
              let result = {
                'status': 201,
                'message': 'Donation Created'
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
    if (checkInput(req.body.id,'number',null) && checkInput(req.body.amount,'number',null) && checkInput(req.body.donor,'number',null) && checkInput(req.body.date,'string',date_re) && checkInput(req.body.frequency,'string',name_re) && checkInput(req.body.method,'number',null) && checkInput(req.body.type,'number',null)) {
      try {
        let id = Number(req.body.id);
        let amount = Number(req.body.amount);
        let donor = Number(req.body.donor);
        let date = req.body.date + '';
        let frequency = req.body.frequency;
        let method = Number(req.body.method);
        let type = Number(req.body.type);
        let comment = null;
        if (req.body.comment) {
          comment = req.body.comment + '';
        }

        knex('nv.donation').update(knex.raw('(amount,donor_id,date,frequency,method_id,type_id,comment) VALUES' +
            '(:amount,:donor_id,:date,:frequency,:method_id,:type_id,:comment)', {
            amount: amount,
            donor_id: donor_id,
            frequency: frequency,
            method_id: method_id,
            type_id: type_id,
            comment: comment
          })).where(knex.raw('?? = ?', ['id', id])).asCallback((error, rows) => {
            if (error) {
              console.log(error);
              let result = {
                'status': 500,
                'message': 'Server Error'
              };
              res.send(result);
            }
            else {
              let result = {
                'status': 200,
                'message': 'Donation Updated'
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
  if (checkInput(req.session.email, 'string', email_re)) {
    if (checkInput(req.body.donation_id, 'number', null)) {
      try {
        let id = Number(req.body.donation_id);
        knex('nv.donation').delete().where(knex.raw('id = :id', {id: id})).asCallback((error, rows) => {
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
              'message': 'Donation Deleted'
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
