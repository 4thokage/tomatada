let notificationPermission: NotificationPermission = "default";

/**
 * Request browser notification permission from the user.
 */
export async function requestNotificationPermission() {
  if (!("Notification" in window)) return;
  if (Notification.permission === "default") {
    notificationPermission = await Notification.requestPermission();
  } else {
    notificationPermission = Notification.permission;
  }
}

/**
 * Play a sound from a given URL.
 */
export function playSound(url: string) {
  const audio = new Audio(url);
  audio.currentTime = 0;
  audio.play().catch(() => {
    // User might not have interacted yet
    console.warn("Audio play prevented. User must interact first.");
  });
}

/**
 * Vibrate device (if supported) with optional pattern.
 */
export function vibrate(pattern: number[] = [200, 100, 200]) {
  if (navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}

/**
 * Show a system notification.
 * @param title Notification title
 * @param options Notification options
 */
export function showNotification(
  title: string,
  options?: NotificationOptions
) {
  if (!("Notification" in window)) return;

  if (notificationPermission === "granted") {
    new Notification(title, options);
  } else {
    console.warn("Notification permission not granted.");
  }
}

/**
 * Call this when Pomodoro finishes.
 * Handles sound, vibration, system notification.
 * Optional callback for UI updates (XP popup, timer pulse, etc.)
 */
export function notifyTimerFinished(
  soundUrl: string,
  title: string = "Pomodoro Complete 🍅",
  body: string = "Take a break!",
  icon: string = "/icons/icon-192.png",
  onFinished?: () => void
) {
  // Play sound
  playSound(soundUrl);

  // Vibrate device
  vibrate();

  // Show system notification
  showNotification(title, { body, icon });

  // Call UI callback
  if (onFinished) onFinished();
}
