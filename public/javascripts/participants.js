'use strict';
var curViewType = 2;

function setup()
{
  //Populate participants table
  var all_participants_info_url = getServer() + "/participants/all";

  $.ajax({
    type: "GET",
    url: all_participants_info_url,
    success: function(response_data)
    {
      if(response_data.status == 200 && response_data.message == 'Successfully accessed participants\' data')
      {
        console.log(response_data.participants.length);
        //Populate table
        var i;
        for(i = 0; i < response_data.participants.length; i++)
        {
          $("#current-member-table-body").append(
            "<tr class=\"no-hover\" onclick=\"GetParticipantInfo(" + response_data.participants[i].id + ");\"><td>" + response_data.participants[i].first_name + " " + response_data.participants[i].last_name + "</td><td>" + response_data.participants[i].email + "</td><td>" + response_data.participants[i].last_contacted.substring(0,10) + "</td></tr>"
          );
        }
      }
      else {
        //log error
        console.log("Error: " + response_data.status);
      }
    }
  });
}

function GetParticipantInfo(member_id)
{
  var participant_info_url = getServer() + "/member/" + member_id;

  $.ajax({
    type: "GET",
    url: participant_info_url,
    success: function(response_data)
    {
      if(response_data.status == 200 && response_data.message == 'Successfully accessed participant data' && response_data.member.id == member_id)
      {
        //Show modal
        ShowModal(response_data.member);
      }
      else {
        //log error
        console.log("Error: " + response_data.message);
      }
    }
  });
}
