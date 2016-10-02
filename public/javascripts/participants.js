'use strict';

function Setup()
{
  //Populate participants table
  var all_participants_info_url = getServer() + "/all";

  $.ajax({
    type: "GET",
    url: all_participants_info_url,
    success: function(response_data)
    {
      if(response_data.status == 200 && response_data.message == "Successfully Accessed Participants\' Data")
      {
        //Populate table
        for(int i = 0; i < response_data.participants; i++)
        {
          $("#participants-table-body").append(
            "<tr onclick=GetParticipantInfo(" + response_data.participants[i] + ");><td>" +  + "</td><td>" +  + "</td><td>" +  + "</td></tr>"
          );
        }
      }
      else {
        //log error
        console.log("Error: " + response_data.message);
      }
    }
  });

}

function GetParticipantInfo()
{
  var participant_info_url = getServer() + "/get/" + member_id;

  $.ajax({
    type: "GET",
    url: participant_info_url,
    success: function(response_data)
    {
      if(response_data.status == 200 && response_data.message == "Successfully Accessed Participant Data")
      {
        //Make modal
      }
      else {
        //log error
        console.log("Error: " + response_data.message);
      }
    }
  });
}
