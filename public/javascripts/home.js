'use strict';

$(function() {
    drawGraphs()
});

function drawGraphs(){
  drawDonateGraph();
  drawParticipentGraph();
  drawServiceGraph();
}

function drawDonateGraph(){
  var pieData = [
   {
      value: 20,
      label: 'First Time Donor',
      color: '#00539F'
   },
   {
      value: 20,
      label: 'Recurring Donor',
      color: '#FFD200'
   },
   {
      value: 20,
      label: 'Program Participent',
      color: '#edf7ff'
   },
   {
      value : 20,
      label: 'Member',
      color: '#FFF5C4'
   },
   {
      value : 20,
      label: 'Community Partner',
      color: '#6E5494'
   }];

   var context = document.getElementById('donateTrend-graph').getContext('2d');
   var chart = new Chart(context).Pie(pieData);
}

function drawParticipentGraph(){
  var lineData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    datasets: [{
    fillColor: 'rgba(0,0,0,0)',
    strokeColor: 'rgba(220,180,0,1)',
    pointColor: 'rgba(220,180,0,1)',
    data: [121, 165, 125, 121]
  }]
  }

   var context = document.getElementById('partTrend-graph').getContext('2d');
   var chart = new Chart(context).Line(lineData);
}

function drawServiceGraph(){
  var pieData = [
   {
      value: 5,
      label: 'Family to Family',
      color: '#00539F'
   },
   {
      value: 10,
      label: 'Basics',
      color: '#FFD200'
   },
   {
      value: 20,
      label: 'InVoice',
      color: '#edf7ff'
   },
   {
      value : 25,
      label: 'P&T as Allies',
      color: '#FFF5C4'
   },
   {
      value : 12,
      label: 'Connections',
      color: '#6E5494'
   },
   {
      value : 28,
      label: 'Family Support Group',
      color: '#9680b7'
   }];

   var context = document.getElementById('serviceTrend-graph').getContext('2d');
   var chart = new Chart(context).Pie(pieData);
}
