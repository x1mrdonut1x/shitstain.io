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

  const logsContainer = document.getElementById('game-logs');

  if (logsContainer && (logsContainer?.childElementCount || 0) > 10) {
    if (logsContainer.firstChild) {
      logsContainer?.removeChild(logsContainer.firstChild);
    }
  }

  logsContainer?.appendChild(entry);
}
