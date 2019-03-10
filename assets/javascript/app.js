$(document).ready(function() {

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyChLrIW3eq2bzl8Zw0024BFViImX3MB_-s",
    authDomain: "train-scheduler-bfff6.firebaseapp.com",
    databaseURL: "https://train-scheduler-bfff6.firebaseio.com",
    projectId: "train-scheduler-bfff6",
    storageBucket: "train-scheduler-bfff6.appspot.com",
    messagingSenderId: "218840819929"
  };
  firebase.initializeApp(config);

var database = firebase.database();

//when submit button is clicked, push values to firebase
$(".btn").on("click", function(event) {

  //prevent reload of page
  event.preventDefault();

  //grab values from input text areas
  var trainName = $("#train-name").val().trim();
  var destinationT = $("#destination-text").val().trim();
  var trainTime = $("#train-time").val().trim();
  var frequency = $("#frequency-text").val().trim();

  if (trainName == "" || destinationT == "" || trainTime == "" || frequency == "") {
    return false;
  } else {
  //push data to firebase
  database.ref().push({
    trainName: trainName,
    destinationT: destinationT,
    trainTime: trainTime,
    frequency: frequency
  });

  //clear text areas
  $("#train-name").val("");
  $("#destination-text").val("");
  $("#train-time").val("");
  $("#frequency-text").val("");
  }
  
});


//display current time in header
function currentTime() {
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  h = checkTime(h);
  m = checkTime(m);
  s = checkTime(s);

  $("#current-time").text(h + ":" + m + ":" + s);

  var t = setTimeout(currentTime, 500);
}
function checkTime(i) {
  if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
  return i;
}
currentTime();



//get data from firebase and put onto DOM
database.ref().on("child_added", function(childSnapshot) {

  //grab all firebase data
  var trainName = childSnapshot.val().trainName;
  var destinationT = childSnapshot.val().destinationT;
  var trainTime = childSnapshot.val().trainTime;
  var frequency = childSnapshot.val().frequency;

  //push back time 1 year
  var trainTimeConverted = moment(trainTime, "HH:mm").subtract(1, "years");

  //difference between the times
  var diffTime = moment().diff(moment(trainTimeConverted), "minutes");

  //remainder time
  var tRemainder = diffTime % frequency;

  //time until next train
  var timeUntilTrain = frequency - tRemainder;

  //next arrival
  var nextArrival = moment().add(timeUntilTrain, "minutes");

  //put all data into table in DOM
  $(".train-text").append("<tr><td>" +
    trainName + "</td><td>" +
    destinationT + "</td><td>" + 
    frequency + "</td><td>" + 
    moment(nextArrival).format("hh:mm") + "</td><td>" + 
    timeUntilTrain + "</td></tr>"
    );

}, function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
});







//end of document ready
});
