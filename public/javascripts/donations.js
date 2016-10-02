'use strict'

function setup() {
  populateDonors();
  populateTypes();
  populateMethods();
  initializeDatepicker();
}

function populateDonors() {
  
}

function populateTypes() {

}

function populateMethods() {

}

function initializeDatepicker() {

}

function postDonation() {
  var donations_url = getServer()+'/donation';
  donation_data = {

  };
  $.ajax({
    type: "POST",
    url: donation_url,
    data: donation_data,
    success: function(result) {

    }
  });
}
