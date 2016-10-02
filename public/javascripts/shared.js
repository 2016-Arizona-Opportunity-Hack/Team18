'use strict';

function getServer() {
  return location.protocol + '//' + location.hostname + ':' + location.port;
}

function logout()
{
  var logout_url = getServer() + '/session/';
  console.log("here9");
  $.ajax({
    type: "DELETE",
    url: logout_url,
    success: function(response_data)
    {
      console.log("here82");
      if(response_data.status == 200 && response_data.message == "Session Deleted")
      {
        console.log("here73");
        window.location.replace(getServer() + '/');
      }
      else {
        console.log("here64 " + response_data.status + ", " + response_data.message);
      }
    }
  });
}
