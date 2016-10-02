'use strict';

function getServer() {
  return location.protocol + '//' + location.hostname + ':' + location.port;
}

function logout()
{
  var logout_url = getServer() + '/session';
  $.ajax({
    type: "DELETE",
    url: logout_url,
    success: function(response_data)
    {
      if(response_data.status == 200 && response_data.message == "Session Deleted")
      {
        window.location.replace(getServer() + '/');
      }
      else {
        console.log("Error: " + response_data.message);
      }
    }
  });
}

function ShowModal(member_info)
{
  $('#member-modal-title').html(member_info.first_name + "\'s Information");
  $('#member-modal-table-first-name').html(member_info.first_name);
  $('#member-modal-table-last-name').html(member_info.last_name);
  $('#member-modal-table-email').html(member_info.email);
  $('#member-modal-table-phone').html(member_info.phone);
  $('#member-modal-table-address').html(member_info.address);
  $('#member-modal-table-company').html(member_info.company);
  $('#member-modal-table-last-contacted').html(member_info.last_contacted);
  $('#member-modal-save-button').removeAttribute("onclick");
  $('#member-modal-save-button').setAttribute( "onClick", "SaveMemberModalInfo(" + member_info.id + ");" );
  $('#member-modal').modal({
    backdrop: 'static',
    keyboard: false
  });
}

function SaveMemberModalInfo(member_id)
{
  if(member_id != null)
  {
    var info = {
      'type': 2,
      'id': member_id,
      'first_name': $('#member-modal-table-first-name').html,
      'last_name': $('#member-modal-table-last-name').html,
      'phone': $('#member-modal-table-phone').html,
      'email': $('#member-modal-table-email').html,
      'address': $('#member-modal-table-address').html,
      'company': $('#member-modal-table-company').html,
      'last_contacted': $('#member-modal-table-last-contacted').html,
      'interest': $('#member-modal-table-interest').html,
      'preference': $('#member-modal-table-preference').html
    }


  }
  else
  {
    var info = {
      'id': member_id,
      'first_name': $('#member-modal-table-first-name').html,
      'last_name': $('#member-modal-table-last-name').html,
      'phone': $('#member-modal-table-first-name').html,
      'email': $('#member-modal-table-first-name').html,
      'address': $('#member-modal-table-first-name').html,
      'company': $('#member-modal-table-first-name').html,
      'type': $('#member-modal-table-first-name').html,
      'last_contacted': $('#member-modal-table-first-name').html,
      'interest': $('#member-modal-table-first-name').html,
      'preference': $('#member-modal-table-first-name').html
    }
  }
}
