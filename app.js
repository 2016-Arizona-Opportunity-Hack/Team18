'use strict';

let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let pg_tool = require('./bin/pg_tool');
let redis_tool = require('./bin/redis_tool');
let session_tool = require('./bin/session_tool');
let amqp_handler = require('./bin/amqp_handler');
let app = express();

amqp_handler.start((err) => {
  if (err != null) {
    console.log(err);
  }
  else {
    let index = require('./routes/index');
    let member = require('./routes/member');
    let donation = require('./routes/donation');

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.static('./public'));
    app.use(express.static('./public/stylesheets'));
    app.use(express.static('./public/images'));
    app.use(express.static('./public/javascripts'));
    app.use(session_tool);

    app.use('/', index);
    app.use('/member', member);
    app.use('/donation', donation);

    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    app.use(function(req, res) {
      res.render('lost');
    });
  }
});

module.exports = app;
