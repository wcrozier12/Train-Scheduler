window.onload = function() {

var config = {
    apiKey: "AIzaSyDHnRrCDIpZeaMtlPRqRjTdN0a66otmkzM",
    authDomain: "rock-d2b18.firebaseapp.com",
    databaseURL: "https://rock-d2b18.firebaseio.com",
    projectId: "rock-d2b18",
    storageBucket: "rock-d2b18.appspot.com",
    messagingSenderId: "818423081654"
  };
  firebase.initializeApp(config);

var database = firebase.database();

var train = '';
var destination = '';
var firstTrain = ''
var frequency = 0;
var nextTrain = 0;
var minutesAway = 0;
var convertedFirstTrain = '';
var now = moment();
var firstToNow = 0;
var intervalID;
var counter = 0;

let update = function(){

database.ref().once('value').then(function(snapShot){
  $('#minutesAwayDisplay').empty();
  $('#nextDisplay').empty()
  snapShot.forEach(function(childSnapShot) {
    now = moment();
    frequency = childSnapShot.val().frequency;
    firstTrain = childSnapShot.val().firstTrain;
    firstTrainMoment = moment(firstTrain, 'HH:mm');
    firstToNext = (Math.ceil((now.diff(firstTrainMoment, 'minutes') / frequency)) * frequency);
    nextTrain = firstTrainMoment.add(firstToNext, 'minutes').format('hh:mm A');
    nextTrainMoment = moment(nextTrain, 'hh:mm A');
    minutesAway = nextTrainMoment.diff(now, 'minutes');
    $('<div></div').appendTo($('#nextDisplay')).html(nextTrain);
    $('<div></div').appendTo($('#minutesAwayDisplay')).html(minutesAway + ' minutes');
  })

})
intervalID = setInterval(update, 60000)
};


database.ref().on('child_added', function(childSnapShot){
  frequency = childSnapShot.val().frequency;
  firstTrain = childSnapShot.val().firstTrain;
  firstTrainMoment = moment(firstTrain, 'HH:mm');
  firstToNext = (Math.ceil((now.diff(firstTrainMoment, 'minutes') / frequency)) * frequency);
  nextTrain = firstTrainMoment.add(firstToNext, 'minutes').format('hh:mm A');
  nextTrainMoment = moment(nextTrain, 'hh:mm A');
  minutesAway = nextTrainMoment.diff(now, 'minutes');

  $('<div></div>').appendTo($('#trainDisplay')).html(childSnapShot.val().train);
  $('<div></div>').appendTo($('#destinationDisplay')).html(childSnapShot.val().destination);
  $('<div></div>').appendTo($('#frequencyDisplay')).html(childSnapShot.val().frequency);
  $('<div></div>').appendTo($('#nextDisplay')).html(nextTrain);
  $('<div></div>').appendTo($('#minutesAwayDisplay')).html(minutesAway + ' minutes');
});


$('#submit').on('click', function(event){
  event.preventDefault();

      train = $("#trainInput").val().trim();
      destination = $("#destinationInput").val().trim();
      firstTrain = $("#firstTrainInput").val().trim();
      frequency = $('#frequencyInput').val().trim();

      database.ref().push({
        train: train,
        destination: destination,
        frequency: frequency,
        firstTrain: firstTrain,
        dateAdded: firebase.database.ServerValue.TIMESTAMP,
      })
$("#trainInput:text").val('');
$("#destinationInput:text").val('');
$("#firstTrainInput:text").val('');
$('#frequencyInput:text').val('');

});

update();
};
