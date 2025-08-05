const synth = window.speechSynthesis;
const voiceSelect = document.getElementById("voiceSelect");
const textArea = document.getElementById("text");
let voices = [];

function populateVoices() {
  voices = synth.getVoices();
  voiceSelect.innerHTML = '';
  
  voices.forEach((voice, index) => {
    const option = document.createElement("option");
    option.value = index;
    // Map voice names to "celebrity-style" tags
    let label = voice.name;
    if (voice.name.includes("Google हिन्दी")) label = "📢 Bollywood (Hindi Male)";
    else if (voice.name.includes("Google UK English Male")) label = "🎬 Hollywood (Male - Morgan)";
    else if (voice.name.includes("Google US English Female")) label = "🎤 Pop Star (Female)";
    option.textContent = `${label} (${voice.lang})`;
    voiceSelect.appendChild(option);
  });
}

populateVoices();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoices;
}

function speak() {
  const text = textArea.value;
  if (!text) return alert("Please enter some text.");
  const utter = new SpeechSynthesisUtterance(text);
  utter.voice = voices[voiceSelect.value];
  synth.speak(utter);
}

// RECORDING
let mediaRecorder;
let audioChunks = [];

function startRecording() {
  const stream = document.querySelector('audio').captureStream?.();
  if (!stream) {
    alert("Recording requires Chrome or modern browser.");
    return;
  }

  mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.start();
  audioChunks = [];

  mediaRecorder.ondataavailable = e => {
    audioChunks.push(e.data);
  };

  mediaRecorder.onstop = () => {
    const blob = new Blob(audioChunks, { type: 'audio/webm' });
    const url = URL.createObjectURL(blob);
    const player = document.getElementById("audioPlayer");
    player.src = url;
    player.style.display = "block";

    const a = document.createElement("a");
    a.href = url;
    a.download = "voice-output.webm";
    a.click();
  };
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
  }
}