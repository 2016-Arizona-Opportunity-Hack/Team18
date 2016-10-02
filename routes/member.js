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
const phone_re = /^(\+\d{1,2}){0,1}(\d|-|\(|\)){7,14}$/;

let router = express.Router();

router.get('/interests', function(req, res) {
  if (checkInput(req.session.email, 'string', email_re)) {
    try {
      knex('nv.engagement_interest').asCallback((error, rows) => {
        let result = {
          'status': 200,
          'interests': rows
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

router.get('/preferences', function(req, res) {
  if (checkInput(req.session.email, 'string', email_re)) {
    try {
      knex('nv.communication_preference').asCallback((error, rows) => {
        let result = {
          'status': 200,
          'preferences': rows
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


router.get('/all', function(req, res) {
  if (checkInput(req.session.email, 'string', email_re)) {
    try {
      knex('nv.member').asCallback((error, rows) => {
        let result = {
          'status': 200,
          'members': rows
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

router.get('/:id', function(req, res) {
  if (checkInput(req.session.email, 'string', email_re)) {
    if (checkInput(req.params.id, 'number', null)) {
      try {
        let id = Number(req.params.id);
        knex('nv.member').where(knex.raw('id = :id', {id: id})).asCallback((error, rows) => {
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
        let type_id = Number(req.body.type);
        let preference = Number(req.body.preference);
        let last_contacted = req.body.last_contacted + '';
        let interest = Number(req.body.interest);
        let comment = null;
        if (req.body.comment) {
          comment = req.body.comment + '';
        }
        knex('nv.member').insert(knex.raw('(first_name,last_name,phone,email,address,company,type_id,communication_preference_id,last_contacted,engagement_interest_id,comment) VALUES (:first_name,:last_name,:phone,:email,:address,:company,:type_id,:communication_preference_id,:last_contacted,:engagement_interest_id,:comment)', {
          first_name: first_name,
          last_name: last_name,
          phone: phone,
          email: email,
          address: address,
          company: company,
          type_id: type_id,
          communication_preference_id: preference,
          last_contacted: last_contacted,
          engagement_interest_id: interest,
          comment: comment
        })).asCallback((error, rows) => {
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
        let last_contacted = req.body.last_contacted;
        let interest = Number(req.body.interest);
        let comment = null;
        if (req.body.comment) {
          comment = req.body.comment + '';
        }
        knex('nv.member').where('id',id).update({
          first_name: first_name,
          last_name: last_name,
          phone: phone,
          email: email,
          address: address,
          company: company,
          type_id: type,
          communication_preference_id: preference,
          last_contacted: last_contacted,
          engagement_interest_id: interest,
          comment: comment
        }).asCallback((error, rows) => {
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
        knex('nv.member').delete().where(knex.raw('id = :id', {id: id})).asCallback((error, rows) => {
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
