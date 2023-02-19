export function log(value: string) {
  console.log(value);

  const entry = document.createElement('div');
  const logText = document.createElement('span');
  logText.classList.add('text');
  logText.appendChild(document.createTextNode(value));

  const date = new Date();
  const time = document.createElement('span');
  time.appendChild(document.createTextNode(`[${date.toLocaleTimeString()}]`));
  time.classList.add('time');

  entry.appendChild(time);
  entry.appendChild(logText);

  document.getElementById('game-logs')?.appendChild(entry);
}
