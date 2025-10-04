
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday.getTime() - 86400000);
  const startOfWeek = new Date(startOfToday.getTime() - (now.getDay() - 1) * 86400000);

  if (date >= startOfToday) {
    // Today: "10:45 PM"
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  } else if (date >= startOfYesterday) {
    // Yesterday: "Yesterday"
    return 'Yesterday';
  } else if (date >= startOfWeek) {
    // This week: "Tuesday"
    return date.toLocaleDateString([], { weekday: 'long' });
  } else {
    // Older: "12/06/2024"
    return date.toLocaleDateString();
  }
}
