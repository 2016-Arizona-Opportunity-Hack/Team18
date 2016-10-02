'use strict'

function logout()
{
  console.log("here");
  $.ajax({
    type: "DELETE",
    url: login_url,
    data: login_info,
    success: function(response_data)
    {
      console.log("here2");
      if(response_data.status == 200 && response_data.message == "Session Deleted")
      {
        console.log("here3");
        window.location.replace(getServer() + '/');
      }
      else {
        console.log("here4 " + response_data.status + ", " + response_data.message);
      }
    }
  });
}
