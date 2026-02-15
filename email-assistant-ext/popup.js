const APP_URL = 'http://localhost:5173/';

const openAppButton = document.getElementById('openAppButton');

openAppButton?.addEventListener('click', async () => {
  await chrome.tabs.create({ url: APP_URL });
  window.close();
});
