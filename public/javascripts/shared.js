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

var memberUrl = getServer()+'/member';

function GetInterests(member_interest_id)
{
  $.get(memberUrl+'/interests', function(data) {
    if (data.status === 200) {
      var $el = $("#member-modal-table-engagement-interests");
      $.each(data.interests, function(key,value) {
        if(value.id === member_interest_id)
        {
          $el.append($("<option selected></option>").attr("value", value.id).text(value.name));
        }
        else
        {
          $el.append($("<option></option>").attr("value", value.id).text(value.name));
        }
      });
      $('#member-modal-table-engagement-interests').selectpicker('refresh');
    }
  });
}

function GetPreferences(member_preference_id)
{
  $.get(memberUrl+'/preferences', function(data) {
    if (data.status === 200) {
      var $el = $("#member-modal-table-communication-preferences");
      $.each(data.preferences, function(key,value) {
        if(value.id === member_preference_id)
        {
          $el.append($("<option selected></option>").attr("value", value.id).text(value.name));
        }
        else
        {
          $el.append($("<option></option>").attr("value", value.id).text(value.name));
        }
      });
      $('#member-modal-table-communication-preferences').selectpicker('refresh');
    }
  });
}

function ShowModal(member_info)
{
  GetPreferences(member_info.communication_preference_id);
  GetInterests(member_info.engagement_interest_id);

  if(member_info.first_name === null)
  {
    $('#member-modal-title').html("New Information");
  }
  else
  {
    $('#member-modal-title').html(member_info.first_name + "\'s Information");
  }
  $('#member-modal-table-first-name').val(member_info.first_name);
  $('#member-modal-table-last-name').val(member_info.last_name);
  $('#member-modal-table-email').val(member_info.email);
  $('#member-modal-table-phone').val(member_info.phone);
  $('#member-modal-table-address').val(member_info.address);
  $('#member-modal-table-company').val(member_info.company);
  $('#member-modal-table-last-contacted').val(member_info.last_contacted);
  $('#member-modal-save-button').removeAttr("onclick");
  $('#member-modal-save-button').attr( "onclick", "SaveMemberModalInfo(" + member_info.id + ");" );
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
      'type': curViewType,
      'id': member_id,
      'first_name': $('#member-modal-table-first-name').val(),
      'last_name': $('#member-modal-table-last-name').val(),
      'phone': $('#member-modal-table-phone').val(),
      'email': $('#member-modal-table-email').val(),
      'address': $('#member-modal-table-address').val(),
      'company': $('#member-modal-table-company').val(),
      'last_contacted': $('#member-modal-table-last-contacted').val(),
      'interest': $('#member-modal-table-engagement-interests').val(),
      'preference': $('#member-modal-table-communication-preferences').val()
    }

    console.log(info);

    $.ajax({
      type: "PUT",
      url:  getServer() + "/member/",
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
      'type': curViewType,
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
      url: getServer() + "/member/",
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
    if(curViewType === 1)
    {
      //Remove all table rows and repopulate, no donor adding
      $('#current-member-table-body').remove();
      setup();
    }
    else if(curViewType === 2)
    {
      //Remove 2nd row and onward rows and repopulate, keep add row
      var i;
      for(i = document.getElementById('current-member-table-body').getElementsByTagName("tr").length - 1; i > 0; i--)
      {
        document.getElementById('current-member-table-body').deleteRow(i);
      }
      setup();
    }
    else
    {
        console.log("Error: curViewType = " + curViewType);
    }
  }
}
