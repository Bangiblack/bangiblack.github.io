let mediaRecorder;
let recordedChunks = [];

const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const downloadButton = document.getElementById('download');
const videoElement = document.getElementById('recording');

// Disable the stop and download buttons initially
stopButton.disabled = true;
downloadButton.disabled = true;

startButton.addEventListener('click', startRecording);
stopButton.addEventListener('click', stopRecording);
downloadButton.addEventListener('click', downloadRecording);

function startRecording() {
  startButton.disabled = true;
  stopButton.disabled = false;
  recordedChunks = [];

  navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
    .then(stream => {
      mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = function(event) {
        if (event.data.size > 0) {
          recordedChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = function() {
        startButton.disabled = false;
        stopButton.disabled = true;
        downloadButton.disabled = false;

        const videoBlob = new Blob(recordedChunks, { type: 'video/webm' });
        videoElement.src = URL.createObjectURL(videoBlob);
      };

      mediaRecorder.start();
    })
    .catch(err => {
      console.error('Error accessing screen:', err);
    });
}

function stopRecording() {
  startButton.disabled = false;
  stopButton.disabled = true;
  downloadButton.disabled = false;

  mediaRecorder.stop();
}

function downloadRecording() {
  const blob = new Blob(recordedChunks, { type: 'video/webm' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'recording.webm';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
