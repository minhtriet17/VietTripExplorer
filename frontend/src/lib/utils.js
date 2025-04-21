import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


export function formatDateAdvanced(input) {
  let date;

  // Nếu là timestamp (số), convert thành Date
  if (!isNaN(input)) {
    date = new Date(Number(input));
  } else {
    date = new Date(input);
  }

  // Định dạng ngày theo tiếng Việt
  const options = {
    weekday: 'long',    // Chủ Nhật, Thứ Hai, etc.
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,      // 24h format
    timeZone: 'Asia/Ho_Chi_Minh', // giờ Việt Nam
  };

  const formatter = new Intl.DateTimeFormat('vi-VN', options);

  return formatter.format(date);
}

// Ví dụ:
console.log(formatDateAdvanced("2025-03-30T15:22:21.038Z"));
// Kết quả: "Chủ Nhật, 30/03/2025 22:22"

console.log(formatDateAdvanced(1744116352007));
// Kết quả: "Thứ Tư, 08/01/2025 10:59"
