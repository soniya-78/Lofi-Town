import './style.css';

const stations = [
  { name: 'Midnight café', mood: 'Warm keys · gentle beats', chord: [130.81, 164.81, 196, 246.94], color: '#e7af86' },
  { name: 'Rainy rooftops', mood: 'Soft chords · slower days', chord: [146.83, 174.61, 220, 261.63], color: '#9bb9cc' },
  { name: 'Sunset express', mood: 'Mellow grooves · golden hour', chord: [110, 138.59, 164.81, 207.65], color: '#d6a3b7' },
];
document.querySelector('#app').innerHTML = `
<header><a class="brand" href="${import.meta.env.BASE_URL}" aria-label="Lofi Town home"><span class="brand-icon">▥</span> lofi town<span class="brand-dot">✦</span></a><span class="header-note">a little space to slow down</span><span class="live"><i></i> YOUR QUIET CORNER</span></header>
<main><section class="intro"><span class="eyebrow">TUNE OUT THE NOISE</span><h1>Stay a little.<br><em>Find your rhythm.</em></h1><p>Soft beats, familiar streets, and nowhere you need to be.</p></section>
<section class="scene" aria-label="An illustrated nighttime town"><div class="sky"><span class="star s1">✧</span><span class="star s2">✦</span><span class="star s3">·</span><span class="star s4">✧</span><div class="moon"></div><div class="cloud c1"></div><div class="cloud c2"></div></div><div class="scene-label"><i></i> LIVE FROM LOFI TOWN</div><div class="hills hill1"></div><div class="hills hill2"></div><div class="town"><div class="building small left"><div class="roof"></div><div class="windows">▥ ▥<br>▥ ▥<br>▥ ▥</div><div class="store">BOOKS & MORE</div></div><div class="building cafe"><div class="roof"></div><div class="chimney"></div><div class="windows">▥ &nbsp; ▥<br>▥ &nbsp; ▥</div><div class="cafe-sign">☕ MOONLIGHT CAFÉ</div><div class="awning"></div><div class="cafe-front"><span></span><span></span><span></span></div></div><div class="building tall"><div class="roof"></div><div class="windows">▥ ▥<br>▥ ▥<br>▥ ▥<br>▥ ▥</div><div class="store">RECORDS</div></div><div class="tree">♠</div></div><div class="street"><div class="street-line"></div></div><div class="scene-caption">Somewhere between today and tomorrow.</div><div class="scene-time">23:48 <span>☾</span></div></section>
<section class="dashboard"><div class="music-panel"><div class="section-heading"><span class="eyebrow">THE SOUNDTRACK</span><span class="small-note">Original, endlessly cozy loops</span></div><div class="now-playing"><div class="album">☾<span>vol. 01</span></div><div class="track-info"><span class="eyebrow">NOW PLAYING</span><h2 id="track-title">Midnight café</h2><p id="track-mood">Warm keys · gentle beats</p></div><button id="play" class="play" aria-label="Play music">▶</button></div><div class="volume-row"><span aria-hidden="true">♫</span><label for="volume">Music volume</label><input id="volume" type="range" min="0" max="100" value="55"><output id="volume-value">55%</output></div><div class="stations">${stations.map((s, i) => `<button class="station ${i === 0 ? 'active' : ''}" data-station="${i}"><span class="station-art" style="--station-color:${s.color}">${['☕','☂','☀'][i]}</span><span>${s.name}<small>${s.mood}</small></span><span class="station-indicator">${i === 0 ? '●' : '↗'}</span></button>`).join('')}</div></div><aside><div class="ambient"><div class="section-heading"><span class="eyebrow">MAKE IT YOURS</span><span>✧</span></div><h2>A little atmosphere</h2><p>Layer in the sounds of your evening.</p><label class="ambient-row" for="rain"><span>☂ <span>Rain on the window</span></span><input id="rain" type="range" min="0" max="100" value="0" aria-label="Rain volume"></label><label class="ambient-row" for="vinyl"><span>◎ <span>Vinyl warmth</span></span><input id="vinyl" type="range" min="0" max="100" value="0" aria-label="Vinyl noise volume"></label><small class="audio-note" id="audio-status" role="status">Press play to settle in.</small></div><div class="focus"><div><span class="eyebrow">ONE THING AT A TIME</span><h2>A moment of focus</h2></div><div class="timer-row"><span id="timer" role="timer">25:00</span><button id="focus-start">Start session <span>↗</span></button><button id="focus-reset" aria-label="Reset focus timer">↺</button></div><p id="focus-status">A small step is still a step.</p></div></aside></section>
<footer><span>Made for unhurried moments.</span><span>Take a breath. You're right where you need to be. <span class="footer-star">✦</span></span></footer></main>`;

let context, master, musicGain, rainGain, vinylGain, playing = false, station = 0, interval, beat = 0;
const $ = (id) => document.getElementById(id);
function initializeAudio() {
  context = new AudioContext();
  master = context.createGain(); master.gain.value = 0; master.connect(context.destination);
  const compressor = context.createDynamicsCompressor(); compressor.connect(master);
  musicGain = context.createGain(); musicGain.gain.value = 0.55; musicGain.connect(compressor);
  const buffer = context.createBuffer(1, context.sampleRate * 3, context.sampleRate);
  const data = buffer.getChannelData(0); for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  function noise(frequency, type) {
    const source = context.createBufferSource(); source.buffer = buffer; source.loop = true;
    const filter = context.createBiquadFilter(); filter.type = type; filter.frequency.value = frequency;
    const gain = context.createGain(); gain.gain.value = 0; source.connect(filter); filter.connect(gain); gain.connect(compressor); source.start(); return gain;
  }
  rainGain = noise(650, 'lowpass'); vinylGain = noise(2500, 'highpass');
}
function tone(frequency, duration, level, type = 'sine', delay = 0) {
  const start = context.currentTime + delay;
  const oscillator = context.createOscillator(), envelope = context.createGain(); oscillator.type = type; oscillator.frequency.value = frequency;
  envelope.gain.setValueAtTime(0, start); envelope.gain.linearRampToValueAtTime(level, start + 0.025); envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(envelope); envelope.connect(musicGain); oscillator.start(start); oscillator.stop(start + duration + 0.05);
}
function tick() {
  if (!playing) return;
  const chord = stations[station].chord;
  if (beat % 8 === 0) chord.forEach((f, i) => tone(f, 3.2, 0.055, 'triangle', i * 0.035));
  if (beat % 2 === 0) tone(chord[0] / 2, 0.3, 0.2);
  if (beat % 4 === 2) tone(180, 0.08, 0.06, 'triangle');
  if (beat % 2 === 1) tone(chord[(beat % 8) % 4] * 2, 0.6, 0.035);
  beat++;
}
$('play').addEventListener('click', async () => {
  try {
    if (!context) initializeAudio();
    await context.resume(); playing = !playing;
    master.gain.setTargetAtTime(playing ? 0.65 : 0, context.currentTime, 0.12);
    $('play').textContent = playing ? 'Ⅱ' : '▶'; $('play').setAttribute('aria-label', playing ? 'Pause music' : 'Play music');
    $('audio-status').textContent = playing ? 'You’re tuned in. Make yourself at home.' : 'Paused. Come back whenever you like.';
    document.querySelector('.album').classList.toggle('playing', playing);
    clearInterval(interval); if (playing) { tick(); interval = setInterval(tick, 420); }
    updateAmbience();
  } catch { $('audio-status').textContent = 'Audio could not start. Try pressing play again.'; }
});
function updateAmbience() { if (!context) return; rainGain.gain.setTargetAtTime(Number($('rain').value) / 100 * 0.3, context.currentTime, 0.15); vinylGain.gain.setTargetAtTime(Number($('vinyl').value) / 100 * 0.035, context.currentTime, 0.15); }
$('rain').addEventListener('input', updateAmbience); $('vinyl').addEventListener('input', updateAmbience);
$('volume').addEventListener('input', () => { $('volume-value').value = `${$('volume').value}%`; if (musicGain) musicGain.gain.setTargetAtTime(Number($('volume').value) / 100, context.currentTime, 0.1); });
document.querySelectorAll('.station').forEach(button => button.addEventListener('click', () => {
  station = Number(button.dataset.station); beat = 0;
  $('track-title').textContent = stations[station].name; $('track-mood').textContent = stations[station].mood;
  document.querySelectorAll('.station').forEach((b, i) => { b.classList.toggle('active', i === station); b.querySelector('.station-indicator').textContent = i === station ? '●' : '↗'; });
}));
let remaining = 25 * 60, deadline = 0, timerInterval;
function renderTimer() { $('timer').textContent = `${Math.floor(remaining / 60).toString().padStart(2, '0')}:${(remaining % 60).toString().padStart(2, '0')}`; }
$('focus-start').addEventListener('click', () => {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = undefined; $('focus-start').textContent = 'Resume session ↗'; $('focus-status').textContent = 'Take your time. Your session is paused.'; return; }
  if (remaining === 0) remaining = 1500;
  deadline = Date.now() + remaining * 1000; $('focus-start').textContent = 'Pause session Ⅱ'; $('focus-status').textContent = 'Just you and the next small thing.';
  timerInterval = setInterval(() => { remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000)); renderTimer(); if (!remaining) { clearInterval(timerInterval); timerInterval = undefined; $('focus-start').textContent = 'Start again ↗'; $('focus-status').textContent = 'Nicely done. Stretch, breathe, take a break.'; } }, 250);
});
$('focus-reset').addEventListener('click', () => { clearInterval(timerInterval); timerInterval = undefined; remaining = 1500; renderTimer(); $('focus-start').textContent = 'Start session ↗'; $('focus-status').textContent = 'A small step is still a step.'; });
