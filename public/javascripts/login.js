'use strict'
const email_re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function login()
{
  var email = $("#email").val();
  var password = $("#password").val();
  var pass_re = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9!@#$%^&*/._+-]{8,31})$/;
  if(email_re.test(email) && pass_re.test(password))
  {
    var login_url = getServer() + "/auth";
    var login_info = {
      email: email,
      password: password
    };
    $.ajax({
      type: "POST",
      url: login_url,
      data: login_info,
      success: function(response_data)
      {
        if(response_data.status == 200 && response_data.message == "Successfully Authenticated")
        {
          window.location.replace(getServer() + '/');
        }
        else {
          failedLogin(response_data);
        }
      }
    });
  }
  else
  {
      failedLogin({status: 400});
  }
}

function failedLogin(response_data)
{
  if(response_data.status == 500)
  {
    $("#failed-login").text = "Server issues";
  }
  else
  {
    $("#failed-login").text("Incorrect email or password");
  }

  $("#failed-login").removeClass("hidden");
}
