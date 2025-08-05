// ========== TEXT TO SPEECH ==========
function speakText() {
  const text = document.getElementById("text-input").value;
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}

// ========== VOICE RECORDER ==========
let mediaRecorder;
let audioChunks = [];

const startBtn = document.getElementById("start-record");
const stopBtn = document.getElementById("stop-record");
const downloadLink = document.getElementById("download-link");

startBtn.onclick = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);
  audioChunks = [];

  mediaRecorder.ondataavailable = event => {
    audioChunks.push(event.data);
  };

  mediaRecorder.onstop = () => {
    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
    const audioUrl = URL.createObjectURL(audioBlob);
    downloadLink.href = audioUrl;
    downloadLink.style.display = "inline-block";
  };

  mediaRecorder.start();
  startBtn.disabled = true;
  stopBtn.disabled = false;
};

stopBtn.onclick = () => {
  mediaRecorder.stop();
  startBtn.disabled = false;
  stopBtn.disabled = true;
};
