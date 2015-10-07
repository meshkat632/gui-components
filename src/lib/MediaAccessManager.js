function successCallback(stream) {
    console.log('navigator.getUserMedia success: stream:', stream);
    window.stream = stream; // make stream available to console
    videoElement.src = window.URL.createObjectURL(stream);
    videoElement.play();

}

function errorCallback(error) {
    console.error('navigator.getUserMedia error: ', error);
}

function start() {
    videoElement.src = window.URL.createObjectURL(window.stream);
    videoElement.play();
}
function stop() {
    videoElement.pause();
    videoElement.src = "";
    videoElement.load();
}

function ask(successCallback, errorCallback) {
    var constraints = {
        audio: true,
        video: true
    };
    console.log('constraints', JSON.stringify(constraints));
    navigator.getUserMedia(constraints, successCallback, errorCallback);
}
var eventNames = [];
var isAllowed = false;
var videoElement = undefined;
let MediaAccessManager = {
    "init": function ($document) {
        videoElement = $document.querySelector('video');
    },
    "ask": ask,
    "start": start,
    "stop": stop
}
export default MediaAccessManager;
