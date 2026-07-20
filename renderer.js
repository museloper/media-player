const media = document.getElementById('media');
const nowPlaying = document.getElementById('nowPlaying');
const playlistEl = document.getElementById('playlist');
const addBtn = document.getElementById('addBtn');
const clearBtn = document.getElementById('clearBtn');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let playlist = [];
let currentIndex = -1;

function fileName(filePath) {
  return filePath.split(/[\\/]/).pop();
}

function render() {
  playlistEl.innerHTML = '';
  playlist.forEach((filePath, i) => {
    const li = document.createElement('li');
    li.className = i === currentIndex ? 'active' : '';

    const name = document.createElement('span');
    name.className = 'name';
    name.textContent = fileName(filePath);
    name.title = filePath;
    name.addEventListener('dblclick', () => play(i));

    const remove = document.createElement('span');
    remove.className = 'remove';
    remove.textContent = '✕';
    remove.addEventListener('click', (e) => {
      e.stopPropagation();
      removeItem(i);
    });

    li.appendChild(name);
    li.appendChild(remove);
    playlistEl.appendChild(li);
  });
}

function play(index) {
  if (index < 0 || index >= playlist.length) return;
  currentIndex = index;
  media.src = 'file://' + playlist[index];
  media.play();
  nowPlaying.textContent = fileName(playlist[index]);
  render();
}

function removeItem(index) {
  playlist.splice(index, 1);
  if (index === currentIndex) {
    media.pause();
    media.removeAttribute('src');
    media.load();
    currentIndex = -1;
    nowPlaying.textContent = '재생할 항목을 선택하세요';
  } else if (index < currentIndex) {
    currentIndex -= 1;
  }
  render();
}

function addFiles(paths) {
  if (paths.length === 0) return;
  const wasEmpty = playlist.length === 0;
  playlist.push(...paths);
  render();
  if (wasEmpty) play(0);
}

addBtn.addEventListener('click', async () => {
  addFiles(await window.api.selectFiles());
});

const playlistPane = document.querySelector('.playlist-pane');

// Electron navigates to a dropped file by default; block that everywhere.
document.addEventListener('dragover', (e) => e.preventDefault());
document.addEventListener('drop', (e) => e.preventDefault());

playlistPane.addEventListener('dragenter', (e) => {
  e.preventDefault();
  playlistPane.classList.add('drag-over');
});

playlistPane.addEventListener('dragover', (e) => {
  e.preventDefault();
});

playlistPane.addEventListener('dragleave', (e) => {
  if (e.target === playlistPane) playlistPane.classList.remove('drag-over');
});

playlistPane.addEventListener('drop', (e) => {
  e.preventDefault();
  playlistPane.classList.remove('drag-over');
  const paths = [...e.dataTransfer.files].map((f) => window.api.getPathForFile(f));
  addFiles(paths);
});

clearBtn.addEventListener('click', () => {
  media.pause();
  media.removeAttribute('src');
  media.load();
  playlist = [];
  currentIndex = -1;
  nowPlaying.textContent = '재생할 항목을 선택하세요';
  render();
});

playBtn.addEventListener('click', () => {
  if (currentIndex === -1 && playlist.length > 0) {
    play(0);
    return;
  }
  if (media.paused) media.play();
  else media.pause();
});

prevBtn.addEventListener('click', () => play(currentIndex - 1));
nextBtn.addEventListener('click', () => play(currentIndex + 1));

media.addEventListener('ended', () => {
  if (currentIndex + 1 < playlist.length) play(currentIndex + 1);
});

media.addEventListener('play', () => { playBtn.textContent = '⏸ 일시정지'; });
media.addEventListener('pause', () => { playBtn.textContent = '▶ 재생'; });
