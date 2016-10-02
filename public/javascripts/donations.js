'use strict'

var baseUrl = getServer()+'/donation/';

function setup() {
  populateDonors();
  populateTypes();
  populateMethods();
  initializeDatepicker();
}

function populateDonors() {
  $.get(baseUrl+'donors', function(data) {
    if (data.status === 200) {
      var $el = $("#donor");
      $.each(data.donors, function(key,value) {
        $el.append($("<option></option>").attr("value", value.id).text(value.first_name+' '+value.last_name));
      });
      $('#donor').selectpicker('refresh');
    }
  });
}

function populateTypes() {
  $.get(baseUrl+'types', function(data) {
    if (data.status === 200) {
      var $el = $("#type");
      $.each(data.types, function(key,value) {
        $el.append($("<option></option>").attr("value", value.id).text(value.name));
      });
      $('#type').selectpicker('refresh');
    }
  });
}

function populateMethods() {
  $.get(baseUrl+'methods', function(data) {
    if (data.status === 200) {
      var $el = $("#method");
      $.each(data.methods, function(key,value) {
        $el.append($("<option></option>").attr("value", value.id).text(value.name));
      });
      $('#method').selectpicker('refresh');
    }
  });
}

function initializeDatepicker() {

}

function postDonation() {
  var donations_url = getServer()+'/donation';
  var donation_data = {
    amount: $('#amount').val(),
    donor: $('.selectpicker').val(),
    date: '2016-08-04',
    frequency: $('#frequency').val(),
    method: $('#method').val(),
    type: $('#type').val(),
    comment: $('#comment').val()
  };
  console.log(donation_data);
  $.ajax({
    type: "POST",
    url: donations_url,
    data: donation_data,
    success: function(result) {
      console.log(result);
    }
  });
}
