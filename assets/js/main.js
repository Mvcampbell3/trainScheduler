// Initialize Firebase
var config = {
    apiKey: "AIzaSyBzNqgoUtKV9EYpoYmTy5eXzAt2Zo4fDpI",
    authDomain: "testing-firebase-a8804.firebaseapp.com",
    databaseURL: "https://testing-firebase-a8804.firebaseio.com",
    projectId: "testing-firebase-a8804",
    storageBucket: "testing-firebase-a8804.appspot.com",
    messagingSenderId: "1068939047740"
};
firebase.initializeApp(config);


$(".subBtn").on("click", function (event) {
    event.preventDefault();
    console.log("working");
    saveData();
    setTimeout(getData, 1000);
});

var trainDatabase = firebase.database().ref("trainDatabase");

function saveData() {
    var name = $("#trainName").val().trim();
    var destination = $("#destination").val().trim();
    var initDepart = $("#initDepart").val().trim();
    var freq = $("#freq").val().trim();


    var showMe = [];
    showMe.push(name, destination, initDepart, freq);

    console.log(showMe);

    document.getElementById("myForm").reset();

    saveTrain(name, destination, initDepart, freq);
};

function saveTrain(name, destination, initDepart, freq) {

    var newTrain = trainDatabase.push();

    newTrain.set({
        name: name,
        destination: destination,
        initDepart: initDepart,
        freq: freq
    })
};

function getData() {
    $(".appendHere").html("");
    var trainInfo = firebase.database().ref("trainDatabase").once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();
            // ...
            // console.log(childKey);
            // console.log(childData);

            var dataTime = childData.initDepart.toString();
            var long = childData.initDepart.toString().length;

            // console.log(long + " init depart has this many characters");

            switch (long) {
                case 3:
                    dataTime = "0" + dataTime;
                    console.log("long is 3 " + dataTime);
                    break;
                case 4:
                    console.log("long is 4 " + dataTime);
                    break;
                case 5:
                    var dataTimeArray = dataTime.split("");
                    dataTimeArray.splice(2, 1);
                    dataTime = dataTimeArray.join("");
                    // console.log("long is 5 " + dataTime);
                    break;
                default:
                    console.log("initDepart has " + long + " characters in it");
            };

            var answer = timeUntil(dataTime, childData.freq);

            // console.log(answer);



            var newRow = $("<div>").attr("class", "row text-center");
            var nameH = $("<h6>").attr("class", "col-3").text(childData.name);
            var destH = $("<h6>").attr("class", "col-2").text(childData.destination);
            var freqH = $("<h6>").attr("class", "col-3").text(childData.freq);
            var nextArrive = $("<h6>").attr("class", "col-2").text(answer.nextTrain.format("LT"));
            var minUntil = $("<h6>").attr("class", "col-2").text(answer.minLeft);

            var now = moment();
            if (now.diff(answer.departTime) < 0) {
                console.log("train hasn't started yet");
                nextArrive = $("<h6>").attr("class", "col-2").text(answer.departTime.format("LT"));
                minUntil = $("<h6>").attr("class", "col-2").text(answer.departTime.diff(now, "minutes"));
            } else{
                console.log("train is running");
            }

            newRow.append(nameH, destH, freqH, nextArrive, minUntil);
            $(".appendHere").append(newRow);

        });
    });

    // console.log(trainInfo);
}


var timer = setInterval(function(){
    getData();
    console.log("---------------------15 sec timer ran-----------------------");
}, 15000);



function timeUntil(startTime, freq) {
    var now = moment();
    // console.log(now);
    var startTimeArray = startTime.split("");
    // console.log(startTimeArray);
    var hours = startTimeArray[0] + startTimeArray[1];
    var minutes = startTimeArray[2] + startTimeArray[3];

    // console.log(hours);
    // console.log(minutes);

    var departTime = moment().set({ "hours": hours, "minutes": minutes, "seconds": 0});

    console.log(departTime.format("LT"));
    // Sometimes is accurate, sometimes is off by 1
    var difference = now.diff(departTime, "minutes");

    // console.log(difference);

    var remainder = difference % freq;

    // console.log(remainder);

    var nextArrival = moment().add((freq - remainder), "minutes");

    // console.log(nextArrival.format("LT"));

    var answer = {
        minLeft: freq - remainder,
        nextTrain: nextArrival,
        departTime: departTime,
    }

    return answer;
}



