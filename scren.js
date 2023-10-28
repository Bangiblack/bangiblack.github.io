const start = document.getElementById("start");
const stop = document.getElementById("stop");
const download = document.getElementById("download");
const video = document.querySelector("video");
let recorder, stream;

async function startRecording() {
  stream = await navigator.mediaDevices.getDisplayMedia({
    // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    audio: true,
    video: { mediaSource: "screen", displaySurface: "monitor" }
  });
  recorder = new MediaRecorder(stream, {
    // https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder
    mimeType: "video/webm"
  });

  const chunks = [];
  recorder.ondataavailable = (e) => chunks.push(e.data);
  recorder.onstop = (e) => {
    video.src = URL.createObjectURL(new Blob(chunks, { type: chunks[0].type }));
  };

  recorder.start();
}

start.addEventListener("click", () => {
  start.setAttribute("disabled", true);
  stop.removeAttribute("disabled");
  download.setAttribute("disabled", true);

  startRecording();
});

stop.addEventListener("click", () => {
  stop.setAttribute("disabled", true);
  start.removeAttribute("disabled");
  download.removeAttribute("disabled");
  recorder.stop();
  stream.getVideoTracks()[0].stop();
});

download.addEventListener("click", () => {
  const link = document.createElement("a");
  link.style.display = "none";
  link.setAttribute("download", "video.webm");
  link.setAttribute("target", "_blank");
  link.href = video.src;
  document.body.appendChild(link);
  link.click();
  link.remove();
});
