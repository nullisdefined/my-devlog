import { format, isToday, isYesterday, isSameDay } from "date-fns";
import { ko } from "date-fns/locale";

export function formatMessageDate(timestamp: number): string {
  if (isToday(timestamp)) {
    return "오늘";
  } else if (isYesterday(timestamp)) {
    return "어제";
  }
  return format(timestamp, "yyyy년 M월 d일", { locale: ko });
}
