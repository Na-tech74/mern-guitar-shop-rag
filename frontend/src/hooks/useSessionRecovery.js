import { useEffect } from "react";
import { API } from "../api/axiosClient";

/**
 * useSessionRecovery
 * Hook phục hồi phiên đăng nhập khi user mở lại tab mới.
 *
 * Luồng xử lý:
 * 1. Nếu sessionStorage còn userInfo → chỉ listen BroadcastChannel
 *    (để trả lời khi tab khác hỏi "có ai đang login không?")
 * 2. Nếu không có → hỏi các tab khác qua BroadcastChannel
 *    - Có tab khác đang login → KHÔNG recover (giữ mỗi tab độc lập)
 *    - Không có → gọi POST /auth/refresh (dùng refresh cookie 7 ngày)
 *
 * Mục đích:
 * - Mở tab mới khi đã có tab đang login → tab mới KHÔNG tự đăng nhập theo
 * - Đóng hết tab → mở lại browser → vẫn tự đăng nhập nhờ refresh cookie
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
        let recoverTimer;
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
            if (cancelled) return;
            channel.postMessage({ type: "who-has-session" });

            recoverTimer = setTimeout(async () => {
                if (cancelled || otherTabHasSession) return;

                try {
                    const refreshRes = await API.post("/auth/refresh");
                    const newToken = refreshRes.data?.data?.accessToken;
                    if (!newToken || cancelled) return;

                    sessionStorage.setItem("token", newToken);

                    try {
                        const profileRes = await API.get("/users/me");
                        const user = profileRes.data?.data;
                        if (user && !cancelled) {
                            sessionStorage.setItem(
                                "userInfo",
                                JSON.stringify({
                                    name: user.name,
                                    email: user.email,
                                    role: user.role
                                })
                            );
                            window.dispatchEvent(new Event("user-info-updated"));
                        }
                    } catch {
                        // Không lấy được profile thì vẫn giữ token, Header sẽ hiển thị "Đăng nhập"
                    }
                } catch {
                    // Refresh token cookie hết hạn hoặc không tồn tại → im lặng, user phải đăng nhập lại
                }
            }, REQUEST_TIMEOUT);
        }, Math.random() * STARTUP_JITTER);

        return () => {
            cancelled = true;
            clearTimeout(startupTimer);
            if (recoverTimer) clearTimeout(recoverTimer);
            channel.removeEventListener("message", handleMessage);
            channel.close();
        };
    }, []);
}
