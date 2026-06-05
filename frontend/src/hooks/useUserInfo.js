import { useEffect, useState } from "react";

const readUserInfo = () => JSON.parse(sessionStorage.getItem("userInfo") || "{}");

/**
 * useUserInfo
 * Hook đọc thông tin user từ sessionStorage và tự động re-render khi:
 * - Login (useLogin setItem)
 * - Logout (useLogout / Header handleLogout removeItem)
 * - Cập nhật hồ sơ (useSettings profile tab)
 * - Phục hồi phiên (useSessionRecovery)
 *
 * Pattern: sessionStorage không có observer built-in, nên dùng custom event
 * `user-info-updated` để các component đồng bộ.
 */
export function useUserInfo() {
    const [userInfo, setUserInfo] = useState(readUserInfo);

    useEffect(() => {
        const handler = () => setUserInfo(readUserInfo());
        window.addEventListener("user-info-updated", handler);
        return () => window.removeEventListener("user-info-updated", handler);
    }, []);

    return userInfo;
}
