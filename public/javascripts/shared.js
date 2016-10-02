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

function GetInterests()
{
  $.get(memberUrl+'/interests', function(data) {
    if (data.status === 200) {
      var $el = $("#member-modal-table-engagement-interests");
      $.each(data.interests, function(key,value) {
        $el.append($("<option></option>").attr("value", value.id).text(value.name));
      });
      $('#member-modal-table-engagement-interests').selectpicker('refresh');
    }
  });
}

function GetPreferences()
{
  $.get(memberUrl+'/preferences', function(data) {
    if (data.status === 200) {
      var $el = $("#member-modal-table-communication-preferences");
      $.each(data.preferences, function(key,value) {
        $el.append($("<option></option>").attr("value", value.id).text(value.name));
      });
      $('#member-modal-table-communication-preferences').selectpicker('refresh');
    }
  });
}

function ShowModal(member_info)
{
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
  $('#member-modal-table-engagement-interests').val(member_info.engagement_interest_id);
  $('#member-modal-table-communication-preferences').val(member_info.communication_preference_id);
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
    var curTable = $('#current-member-table-body');
    if(curTable.name === 'donors-table-body')
    {
      //Remove all table rows and repopulate, no donor adding
      $('#current-member-table-body').remove();
      setup();
    }
    else if(curTable.name === 'participants-table-body')
    {
      //Remove 2nd row and onward rows and repopulate, keep add row
      var i;
      for(i = $('#current-member-table-body').rows.length - 1; i > 0; i--)
      {
        $('#current-member-table-body').removeRow(i);
      }
      setup();
    }
    else
    {
        console.log("Error: tableName = " + tableName);
    }
  }
}
