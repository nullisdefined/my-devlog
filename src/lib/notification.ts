export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    return false;
  }

  let permission = Notification.permission;

  if (permission === "default") {
    permission = await Notification.requestPermission();
  }

  return permission === "granted";
}

export function sendNotification(title: string, body: string) {
  if (Notification.permission === "granted") {
    const notification = new Notification(title, {
      body,
      icon: "/favicon.ico", // 사이트의 파비콘 또는 로고
    });

    notification.onclick = function () {
      window.focus();
      notification.close();
    };
  }
}

// localStorage에서 읽지 않은 메시지 관리
export const unreadMessages = {
  add: (message: { id: string; content: string; timestamp: number }) => {
    const stored = localStorage.getItem("unread-messages");
    const messages = stored ? JSON.parse(stored) : [];
    messages.push(message);
    localStorage.setItem("unread-messages", JSON.stringify(messages));
  },

  get: () => {
    const stored = localStorage.getItem("unread-messages");
    return stored ? JSON.parse(stored) : [];
  },

  clear: () => {
    localStorage.setItem("unread-messages", JSON.stringify([]));
  },

  getCount: () => {
    const stored = localStorage.getItem("unread-messages");
    return stored ? JSON.parse(stored).length : 0;
  },
};
