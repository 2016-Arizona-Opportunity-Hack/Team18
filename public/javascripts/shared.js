'use strict';

function getServer() {
  return location.protocol + '//' + location.hostname + ':' + location.port;
}

function logout()
{
  console.log("here9");
  $.ajax({
    type: "DELETE",
    url: login_url,
    data: login_info,
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
