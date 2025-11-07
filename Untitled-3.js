const audio = document.getElementById("audio");

function playAudio() {
  audio.play();
}

function pauseAudio() {
  audio.pause();
}

function quieter() {
  if (audio.volume > 0.1) audio.volume -= 0.1;
}

function louder() {
  if (audio.volume < 0.9) audio.volume += 0.1;
}

function scrollToComments() {
  const comments = document.getElementById("comments");
  if (comments) {
    comments.scrollIntoView({ behavior: "smooth" });
  }
}
