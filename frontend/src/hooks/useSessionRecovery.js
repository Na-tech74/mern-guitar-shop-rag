import { useEffect } from "react";

/**
 * useSessionRecovery
 * Hook phục hồi phiên đăng nhập khi user mở lại tab mới.
 *
 * Luồng xử lý:
 * 1. Nếu sessionStorage còn userInfo → chỉ listen BroadcastChannel
 *    (để trả lời khi tab khác hỏi "có ai đang login không?")
 * 2. Nếu không có → hỏi các tab khác qua BroadcastChannel
 *    - Có tab khác đang login → KHÔNG recover (giữ mỗi tab độc lập)
 *    - Không có → KHÔNG gọi refresh chủ động (sẽ để interceptor xử lý
 *      lười khi có request bảo vệ thực sự cần). Nhờ vậy user chưa login
 *      không bị 401 "Không tìm thấy refresh token" spam trong Network/Console.
 *
 * Mục đích:
 * - Mở tab mới khi đã có tab đang login → tab mới KHÔNG tự đăng nhập theo
 * - Đóng hết tab → mở lại browser → request bảo vệ đầu tiên sẽ trigger
 *   refresh qua interceptor (nếu cookie còn hạn)
 *
 * Lưu ý: BroadcastChannel không echo message lại cho tab gửi, nên khi tab A
 * gửi "who-has-session" thì chỉ tab B/C/... mới nhận được.
 */
const CHANNEL_NAME = "auth-recovery";
const REQUEST_TIMEOUT = 250; // ms - đợi các tab khác phản hồi
const STARTUP_JITTER = 100; // ms - random delay để tránh race khi mở nhiều tab cùng lúc

export default function useSessionRecovery() {
    useEffect(() => {
        const channel = new BroadcastChannel(CHANNEL_NAME);
        let otherTabHasSession = false;
        let startupTimer;
        let cancelled = false;

        const handleMessage = (e) => {
            if (cancelled) return;
            if (e.data.type === "who-has-session") {
                if (sessionStorage.getItem("userInfo")) {
                    channel.postMessage({ type: "has-session" });
                }
            } else if (e.data.type === "has-session") {
                otherTabHasSession = true;
            }
        };

        channel.addEventListener("message", handleMessage);

        if (sessionStorage.getItem("userInfo")) {
            return () => {
                cancelled = true;
                channel.removeEventListener("message", handleMessage);
                channel.close();
            };
        }

        startupTimer = setTimeout(() => {
            if (cancelled || otherTabHasSession) return;
            channel.postMessage({ type: "who-has-session" });
        }, Math.random() * STARTUP_JITTER);

        return () => {
            cancelled = true;
            clearTimeout(startupTimer);
            channel.removeEventListener("message", handleMessage);
            channel.close();
        };
    }, []);
}
