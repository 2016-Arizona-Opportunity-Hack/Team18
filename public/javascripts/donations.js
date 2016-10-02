'use strict'

function setup() {
  $( "#" ).click(function() {
  });
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
