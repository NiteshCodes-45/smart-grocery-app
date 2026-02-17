import * as Notifications from "expo-notifications";

export async function requestNotificationPermission() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function scheduleDailyReminder(time) {
  const [hours, minutes] = time.split(":").map(Number);

  // Cancel previous reminders first
  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "🛒 Grocery Reminder",
      body: "Don't forget to review your shopping list!",
    },
    trigger: {
      hour: hours,
      minute: minutes,
      repeats: true,
    },
  });
}

export async function scheduleReminderAfterDelay() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "🛍 Items Pending",
      body: "You still have items in your shopping list.",
    },
    trigger: { seconds: 3600 },
  });
}

export async function cancelAllReminders() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
