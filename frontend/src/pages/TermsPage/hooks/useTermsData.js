import { useState, useEffect } from "react";
import { termsContentAPI } from "../../../api";

export default function useTermsData() {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        termsContentAPI.get()
            .then((res) => setContent(res.data?.data?.content))
            .catch(() => {})
            .finally(() => setLoading(false));
        return () => controller.abort();
    }, []);

    return { content, loading };
}
