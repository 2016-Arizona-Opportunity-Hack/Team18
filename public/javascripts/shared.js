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
      if(response_data.status === 200 && response_data.message === "Session Deleted")
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
  $('#member-modal-save-button').setAttribute( "onclick", "SaveMemberModalInfo(" + member_info.id + ");" );
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
      'type': ,
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

    $.ajax({
      type: "PUT",
      url:  getServer() "/member/",
      data: info,
      success: function(response_data)
      {
        if(response_data.status === 200)
        {
          //Repopulate table
          RepopulateCurrentMemberTable();
        }
        else if(response_data.status === 400)
        {
          console.log("Incorrect input");
        }
        else if(response_data.status === 500)
        {
          console.log("Server Error");
        }
        else
        {
          console.log("Error: " + response_data.status);
        }

      }
    });
  }
  else
  {
    var info = {
      'type': 2,
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

    $.ajax({
      type: "POST",
      url: getServer() "/member/",
      data: info,
      success: function(response_data)
      {
        if(response_data.status === 200 && response_data.message === 'Successfully accessed participant data' && response_data.member.id === member_id)
        {
          //Repopulate table
          RepopulateCurrentMemberTable();
        }
        else {
          //log error
          console.log("Error: " + response_data.message);
        }
      }
    });
  }

  function RepopulateCurrentMemberTable()
  {
    var curTable = $(#current-member-table-body);
    if(curTable.name === 'donors-table-body')
    {
      //Remove all table rows and repopulate, no donor adding
      $(#current-member-table-body).remove();
      setup();
    }
    else if(curTable.name === 'participants-table-body')
    {
      //Remove 2nd row and onward rows and repopulate, keep add row
      var i;
      for(i = $(#current-member-table-body).rows.length - 1; i > 0; i--)
      {
        $(#current-member-table-body).removeRow(i);
      }
      setup();
    }
    else if(curTable.name === 'admins-table-body')
    {
      //if superadmin -> add row exists so remove 2nd index onward ... else remove all rows
      if(session.type === 'regular')
      {
        $(#current-member-table-body).remove();
        setup();
      }
      else
      {
        var i;
        for(i = $(#current-member-table-body).rows.length - 1; i > 0; i--)
        {
          $(#current-member-table-body).removeRow(i);
        }
        setup();
      }

    }
    else
    {
        console.log("Error: tableName = " + tableName);
    }
  }
}
