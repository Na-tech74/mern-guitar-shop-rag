import { useState, useEffect } from "react";
import { aboutContentAPI } from "../../../api";

export default function useAboutData() {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const abortController = new AbortController();
        const fetchData = async () => {
            try {
                const res = await aboutContentAPI.get();
                if (!abortController.signal.aborted) {
                    setContent(res.data?.data?.content || null);
                }
            } catch (error) {
                if (error.name !== "CanceledError" && !abortController.signal.aborted) {
                    // silent fail - giữ content null
                }
            } finally {
                if (!abortController.signal.aborted) {
                    setLoading(false);
                }
            }
        };
        fetchData();
        return () => abortController.abort();
    }, []);

    return { content, loading };
}
