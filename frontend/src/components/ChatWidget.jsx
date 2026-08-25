import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faComments, faPaperPlane, faRobot, faXmark,
    faCircle, faUser, faTrash
} from "@fortawesome/free-solid-svg-icons";
import { chatbotAPI } from "../api";

const quickQuestions = [
    "Guitar đắt nhất cửa hàng là gì?",
    "Giá guitar acoustic khoảng bao nhiêu?",
    "Chính sách bảo hành thế nào?",
    "Miễn phí giao hàng không?",
    "Cửa hàng có khóa học guitar không?",
];

function SourceBadges({ sources }) {
    if (!sources) return null;

    const products = sources.products || [];
    const documents = sources.documents || [];

    if (products.length === 0 && documents.length === 0) return null;

    return (
        <div className="mt-2 pt-2 border-t border-gray-100 space-y-1.5">
            {products.length > 0 && (
                <div className="flex flex-wrap gap-1">
                    <span className="text-[10px] text-gray-400 font-medium uppercase">Sản phẩm:</span>
                    {products.map((p, i) => (
                        <a
                            key={i}
                            href={`/products/${p.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-full px-2 py-0.5 inline-flex items-center gap-1 transition-colors"
                        >
                            {p.name}
                            <span className="text-[8px]">↗</span>
                        </a>
                    ))}
                </div>
            )}
            {documents.length > 0 && (
                <div className="flex flex-wrap gap-1">
                    <span className="text-[10px] text-gray-400 font-medium uppercase">Nguồn:</span>
                    {documents.map((d, i) => (
                        <span
                            key={i}
                            className="text-[10px] text-blue-600 bg-blue-50 border border-blue-200 rounded-full px-2 py-0.5 inline-flex items-center gap-1"
                        >
                            {d.title}
                            <span className="text-[9px] text-blue-400">({d.type})</span>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: "bot",
            text: "Xin chào! Mình là trợ lý của Nam Acoustic Guitar Shop. Bạn có thể hỏi mình về:\n\n- Giá cả & so sánh sản phẩm\n- Chính sách bảo hành, đổi trả\n- Giao hàng & thanh toán\n- Hướng dẫn chọn mua guitar\n- Khóa học guitar\n\nHãy thử nhấn vào gợi ý bên dưới hoặc nhập câu hỏi!",
            sources: null,
        },
    ]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const bodyRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const el = bodyRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [messages, typing, open]);

    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 100);
    }, [open]);

    const handleSend = async (raw) => {
        const text = (raw ?? input).trim();
        if (!text || typing) return;

        setMessages((prev) => [...prev, { role: "user", text, sources: null }]);
        setInput("");
        setTyping(true);

        try {
            const { data } = await chatbotAPI.send(text);
            const botData = data?.data || data;
            const reply = botData?.reply || "Mình chưa có câu trả lời. Bạn thử hỏi lại nhé!";
            const sources = botData?.sources || null;
            setMessages((prev) => [...prev, { role: "bot", text: reply, sources }]);
        } catch {
            setMessages((prev) => [
                ...prev,
                { role: "bot", text: "Bot đang khởi động hoặc chưa kết nối được. Vui lòng thử lại sau!", sources: null },
            ]);
        }

        setTyping(false);
    };

    const clearChat = () => {
        setMessages([
            {
                role: "bot",
                text: "Đã xóa hội thoại. Bạn cần tư vấn gì tiếp?",
                sources: null,
            },
        ]);
    };

    return (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
            {open && (
                <div className="mb-3 w-[calc(100vw-2rem)] max-w-sm sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
                    <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-amber-400 to-amber-500">
                        <div className="relative">
                            <div className="size-9 rounded-full bg-white/20 flex items-center justify-center">
                                <FontAwesomeIcon icon={faRobot} className="text-white" />
                            </div>
                            <FontAwesomeIcon
                                icon={faCircle}
                                className="absolute -bottom-0.5 -right-0.5 text-emerald-400 text-[10px] bg-white rounded-full"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white text-sm">Nam Acoustic Support</h3>
                            <p className="text-[11px] text-white/80">Trực tuyến · trả lời ngay</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="size-7 rounded-lg hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                            aria-label="Đóng chat"
                        >
                            <FontAwesomeIcon icon={faXmark} className="text-sm" />
                        </button>
                    </div>

                    <div ref={bodyRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 max-h-[50vh] min-h-[280px]">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                {msg.role === "bot" && (
                                    <div className="size-7 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                                        <FontAwesomeIcon icon={faRobot} className="text-amber-500 text-xs" />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                                        msg.role === "user"
                                            ? "bg-amber-400 text-white rounded-2xl rounded-br-sm"
                                            : "bg-white text-gray-700 border border-gray-100 rounded-2xl rounded-bl-sm shadow-sm"
                                    }`}
                                >
                                    {msg.text}
                                    {msg.role === "bot" && <SourceBadges sources={msg.sources} />}
                                </div>
                                {msg.role === "user" && (
                                    <div className="size-7 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                                        <FontAwesomeIcon icon={faUser} className="text-gray-500 text-xs" />
                                    </div>
                                )}
                            </div>
                        ))}
                        {typing && (
                            <div className="flex items-end gap-2">
                                <div className="size-7 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                                    <FontAwesomeIcon icon={faRobot} className="text-amber-500 text-xs" />
                                </div>
                                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm shadow-sm px-4 py-3 flex gap-1">
                                    <span className="size-1.5 bg-gray-400 rounded-full animate-bounce" />
                                    <span className="size-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                                    <span className="size-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-3 border-t border-gray-100 bg-white">
                        <div className="flex flex-wrap gap-1.5 mb-2.5">
                            {quickQuestions.map((q) => (
                                <button
                                    key={q}
                                    type="button"
                                    onClick={() => handleSend(q)}
                                    className="text-[11px] text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-100 rounded-full px-2.5 py-1 transition-colors"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                placeholder="Nhập tin nhắn..."
                                className="flex-1 min-w-0 px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 transition"
                            />
                            <button
                                type="button"
                                onClick={() => handleSend()}
                                disabled={!input.trim() || typing}
                                className="size-10 rounded-xl bg-amber-400 hover:bg-amber-500 text-white flex items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                                aria-label="Gửi tin nhắn"
                            >
                                <FontAwesomeIcon icon={faPaperPlane} className="text-sm" />
                            </button>
                            <button
                                type="button"
                                onClick={clearChat}
                                className="size-10 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-400 hover:text-gray-600 flex items-center justify-center transition shrink-0"
                                aria-label="Xóa hội thoại"
                                title="Xóa hội thoại"
                            >
                                <FontAwesomeIcon icon={faTrash} className="text-sm" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className={`size-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 ${
                    open
                        ? "bg-gray-800 text-white"
                        : "bg-gradient-to-r from-amber-400 to-amber-500 text-white"
                }`}
                aria-label="Mở chatbot"
            >
                <FontAwesomeIcon icon={open ? faXmark : faComments} className="text-xl" />
            </button>
        </div>
    );
}
