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
const date_re = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

let router = express.Router();

router.get('/:id', function(req, res) {
  if (checkInput(req.session.email, 'string', email_re)) {
    if (checkInput(req.params.id, 'number', null)) {
      try {
        let id = Number(req.params.id);
        pg_tool.query('SELECT * FROM nv.donation WHERE id=$1', [id], function(error, rows) {
          let result = {
            'status': 200,
            'donation': rows[0]
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
        pg_tool.query('INSERT INTO nv.donation(amount,donor_id,date,frequency,method_id,type_id,comment) VALUES ($1, $2, $3, $4, $5, $6, $7)', params, function(error, rows) {
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
        let params = [amount,donor,date,frequency,method,type,comment,id];
        pg_tool.query('UPDATE nv.donation SET amount=$1, donor_id=$2, date=$3, frequency=$4, method_id=$5, type_id=$6, comment=$7 WHERE id=$8', params, function(error, rows) {
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
        pg_tool.query('DELETE FROM nv.donation WHERE id=$1', [id], function(error, rows) {
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
