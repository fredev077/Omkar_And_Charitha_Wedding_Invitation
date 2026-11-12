const opening = document.getElementById("opening");
const openButton = document.getElementById("openInvite");
const musicButton = document.getElementById("musicToggle");
const musicState = document.getElementById("musicState");
const musicToast = document.getElementById("musicToast");
const audio = document.getElementById("weddingAudio");

openButton.addEventListener("click", () => {
  openButton.disabled = true;
  opening.classList.add("is-opening");
  window.setTimeout(() => opening.classList.add("is-revealing"), 1100);
  window.setTimeout(() => {
    opening.classList.add("is-hidden");
    opening.setAttribute("hidden", "");
    document.body.classList.remove("is-sealed");
    musicButton.hidden = false;
    requestAnimationFrame(() => {
      document.body.classList.add("play", "from-opening");
    });
  }, 2100);
});

const reveals = document.querySelectorAll("[data-reveal]");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.28 });
  reveals.forEach((section) => observer.observe(section));
} else {
  reveals.forEach((section) => section.classList.add("is-in"));
}

const strands = document.getElementById("strands");
for (let i = 0; i < 14; i += 1) {
  const strand = document.createElement("span");
  strand.className = "strand";
  strand.style.left = `${4 + i * 6.6}%`;
  strand.style.setProperty("--len", `${90 + (i % 5) * 28}px`);
  strand.style.setProperty("--dur", `${5 + (i % 4)}s`);
  strand.style.setProperty("--delay", `${-i * 0.4}s`);
  strands.appendChild(strand);
}

const countdown = document.getElementById("countdown");
const target = new Date(countdown.dataset.target).getTime();
const units = {
  days: countdown.querySelector('[data-unit="days"]'),
  hours: countdown.querySelector('[data-unit="hours"]'),
  minutes: countdown.querySelector('[data-unit="minutes"]'),
  seconds: countdown.querySelector('[data-unit="seconds"]'),
};
const grid = document.getElementById("cdGrid");
const arrived = document.getElementById("cdArrived");

function pad(value) {
  return String(value).padStart(2, "0");
}

function tick() {
  const remaining = target - Date.now();
  if (remaining <= 0) {
    grid.hidden = true;
    arrived.hidden = false;
    return;
  }
  const totalSeconds = Math.floor(remaining / 1000);
  units.days.textContent = pad(Math.floor(totalSeconds / 86400));
  units.hours.textContent = pad(Math.floor((totalSeconds % 86400) / 3600));
  units.minutes.textContent = pad(Math.floor((totalSeconds % 3600) / 60));
  units.seconds.textContent = pad(totalSeconds % 60);
}

tick();
window.setInterval(tick, 1000);

let musicReady = false;
audio.addEventListener("canplay", () => {
  musicReady = true;
});

function showToast(message) {
  musicToast.textContent = message;
  musicToast.classList.add("is-visible");
  window.setTimeout(() => musicToast.classList.remove("is-visible"), 3200);
}

musicButton.addEventListener("click", async () => {
  if (!audio.paused) {
    audio.pause();
    musicState.textContent = "OFF";
    return;
  }
  try {
    await audio.play();
    musicState.textContent = "ON";
  } catch (error) {
    showToast("Add a music.mp3 file beside this page to play a song.");
  }
});

const canvas = document.getElementById("ambient");
const context = canvas.getContext("2d");
const specks = Array.from({ length: 42 }, () => ({
  x: Math.random(),
  y: Math.random(),
  r: 0.6 + Math.random() * 1.6,
  s: 0.08 + Math.random() * 0.22,
  a: 0.15 + Math.random() * 0.45,
}));

function drawSpecks() {
  const width = canvas.width = window.innerWidth;
  const height = canvas.height = window.innerHeight;
  context.clearRect(0, 0, width, height);
  specks.forEach((speck) => {
    speck.y -= speck.s / height;
    if (speck.y < 0) speck.y = 1;
    context.beginPath();
    context.fillStyle = `rgba(255, 241, 184, ${speck.a})`;
    context.arc(speck.x * width, speck.y * height, speck.r, 0, Math.PI * 2);
    context.fill();
  });
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    requestAnimationFrame(drawSpecks);
  }
}

drawSpecks();
