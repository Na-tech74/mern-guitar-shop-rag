import { useState, useEffect } from "react";
import { homeContentAPI } from "../api";
import defaultLogo from "../assets/images/logo.jpg"

let cachedLogoUrl = null;
let fetchPromise = null;

export default function Logo({ src: propSrc, title, className = "" }) {
    const [logoUrl, setLogoUrl] = useState(propSrc || cachedLogoUrl);

    useEffect(() => {
        if (propSrc) return;
        if (cachedLogoUrl) return;
        if (!fetchPromise) {
            fetchPromise = homeContentAPI.get()
                .then(res => {
                    const url = res.data?.data?.content?.logo?.url;
                    if (url) {
                        cachedLogoUrl = url;
                        setLogoUrl(url);
                    }
                })
                .catch(() => {});
        }
    }, [propSrc]);

    const src = logoUrl || defaultLogo;

    return (
        <div className={`text-center p-2 ${className}`}>
            {title && <h2 className="text-lg font-semibold text-gray-700 mb-2">{title}</h2>}
            <div className="w-52 h-16 overflow-hidden">
                <img src={src} alt="Nam Acoustic" width="1793" height="576" className="w-full h-full object-cover object-center" />
            </div>
        </div>
    );
}