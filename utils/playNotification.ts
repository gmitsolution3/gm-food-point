export function playNotification() {
  const audio = new Audio("/sound/notification.mp3");
  audio.play();
}
