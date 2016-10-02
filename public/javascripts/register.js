'use strict'

var baseUrl = getServer()+'/register/';

function setup() {
  populatePreferences();
  populateInterests();
}

function populatePreferences() {
  $.get(baseUrl+'preferences', function(data) {
    if (data.status === 200) {
      var $el = $("#preference");
      $.each(data.preferences, function(key,value) {
        $el.append($("<option></option>").attr("value", value.id).text(value.name));
      });
      $('#preference').selectpicker('refresh');
    }
  });
}

function populateInterests() {
  $.get(baseUrl+'interests', function(data) {
    if (data.status === 200) {
      var $el = $("#interest");
      $.each(data.interests, function(key,value) {
        $el.append($("<option></option>").attr("value", value.id).text(value.name));
      });
      $('#interest').selectpicker('refresh');
    }
  });
}

function register() {
  var first_name = $('#first_name').val();
  var last_name = $('#last_name').val();
  var phone = $('#phone').val();
  var email = $('#email').val();
  var address = $('#address').val();
  var company = $('#company').val();
  var preference = $('#preference').val();
  var interest = $('#interest').val();
  var captcha = $('#g-recaptcha-response').val();
  if (first_name && last_name && (phone || email) && preference && interest && captcha) {
    var register_url = getServer()+'/';
    var registration_data = {
      'first_name': first_name,
      'last_name': last_name,
      'phone': phone,
      'email': email,
      'address': address,
      'company': company,
      'preference': preference,
      'interest': interest,
      'captcha_response': captcha
    };
    console.log(registration_data);
    $.ajax({
      type: "POST",
      url: register_url,
      data: registration_data,
      success: function(result) {
        console.log(result);
      }
    });
  }
  else {
    console.log('missing params...');
  }
}
