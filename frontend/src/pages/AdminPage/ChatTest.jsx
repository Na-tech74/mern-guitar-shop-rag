import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faRobot, faUser, faPaperPlane, faTrash, faComments,
    faRotate, faDatabase, faClock
} from "@fortawesome/free-solid-svg-icons";
import { chatbotAPI } from "../../api";

const SUGGESTIONS = [
    "Guitar đắt nhất cửa hàng là gì?",
    "So sánh guitar acoustic và classic",
    "Chính sách bảo hành thế nào?",
    "Giá guitar Rosen bao nhiêu?",
    "Miễn phí giao hàng không?",
    "Cửa hàng có khóa học guitar?",
];

export default function ChatTest() {
    const [messages, setMessages] = useState([
        {
            role: "bot",
            text: "Đây là giao diện test chatbot cho admin. Bạn có thể nhập câu hỏi để kiểm tra phản hồi của bot trước khi khách hàng sử dụng.",
            sources: null,
            time: new Date(),
        },
    ]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const [indexSize, setIndexSize] = useState(null);
    const bodyRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const el = bodyRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [messages, typing]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        chatbotAPI.reindex().catch(() => {});
    }, []);

    const handleSend = async (text) => {
        const msg = (text ?? input).trim();
        if (!msg || typing) return;

        const userMsg = { role: "user", text: msg, time: new Date() };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setTyping(true);

        const startTime = Date.now();
        try {
            const { data } = await chatbotAPI.send(msg);
            const botData = data?.data || data;
            const reply = botData?.reply || "Không có phản hồi.";
            const sources = botData?.sources || null;
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
            setMessages((prev) => [...prev, { role: "bot", text: reply, sources, time: new Date(), elapsed }]);
        } catch {
            setMessages((prev) => [
                ...prev,
                { role: "bot", text: "Lỗi kết nối. Bot có thể chưa khởi động.", sources: null, time: new Date() },
            ]);
        }
        setTyping(false);
    };

    const clearChat = () => {
        setMessages([
            {
                role: "bot",
                text: "Đã xóa. Nhập câu hỏi mới để test lại.",
                sources: null,
                time: new Date(),
            },
        ]);
    };

    const formatTime = (d) => d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* HEADER */}
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="size-9 sm:size-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                        <FontAwesomeIcon icon={faComments} className="text-amber-600 text-sm sm:text-lg" />
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-base sm:text-2xl font-bold text-gray-900 whitespace-nowrap">Test Chatbot</h1>
                        <p className="text-[10px] sm:text-sm text-gray-500">Kiểm tra phản hồi trước khi khách hàng sử dụng</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* CHAT AREA */}
                <div className="lg:col-span-2 rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden flex flex-col" style={{ minHeight: "500px" }}>
                    {/* CHAT HEADER */}
                    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-amber-400 to-amber-500">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="size-9 rounded-full bg-white/20 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faRobot} className="text-white" />
                                </div>
                                <FontAwesomeIcon
                                    icon={faClock}
                                    className="absolute -bottom-0.5 -right-0.5 text-emerald-400 text-[10px] bg-white rounded-full"
                                />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white text-sm">Nam Acoustic Bot</h3>
                                <p className="text-[11px] text-white/80">Test mode · Admin</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button onClick={clearChat} className="size-8 rounded-lg hover:bg-white/20 text-white flex items-center justify-center" title="Xóa hội thoại">
                                <FontAwesomeIcon icon={faTrash} className="text-sm" />
                            </button>
                        </div>
                    </div>

                    {/* MESSAGES */}
                    <div ref={bodyRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                {msg.role === "bot" && (
                                    <div className="size-7 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                                        <FontAwesomeIcon icon={faRobot} className="text-amber-500 text-xs" />
                                    </div>
                                )}
                                <div className={`max-w-[85%] ${msg.role === "user" ? "text-right" : ""}`}>
                                    <div
                                        className={`px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                                            msg.role === "user"
                                                ? "bg-amber-400 text-white rounded-2xl rounded-br-sm"
                                                : "bg-white text-gray-700 border border-gray-100 rounded-2xl rounded-bl-sm shadow-sm"
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400">
                                        <span>{formatTime(msg.time)}</span>
                                        {msg.elapsed && <span>· {msg.elapsed}s</span>}
                                    </div>
                                    {/* SOURCES */}
                                    {msg.role === "bot" && msg.sources?.products?.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1.5">
                                            {msg.sources.products.map((p, j) => (
                                                <a
                                                    key={j}
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
                                    {msg.role === "bot" && msg.sources?.documents?.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {msg.sources.documents.map((d, j) => (
                                                <span key={j} className="text-[10px] text-blue-600 bg-blue-50 border border-blue-200 rounded-full px-2 py-0.5">
                                                    {d.title} ({d.type})
                                                </span>
                                            ))}
                                        </div>
                                    )}
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

                    {/* INPUT */}
                    <div className="p-3 border-t border-gray-100 bg-white">
                        <div className="flex items-center gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                placeholder="Nhập câu hỏi test..."
                                className="flex-1 min-w-0 px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 transition"
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={!input.trim() || typing}
                                className="size-10 rounded-xl bg-amber-400 hover:bg-amber-500 text-white flex items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                            >
                                <FontAwesomeIcon icon={faPaperPlane} className="text-sm" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* SIDEBAR */}
                <div className="space-y-4">
                    {/* QUICK TEST */}
                    <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-700">Câu hỏi test nhanh</h3>
                        </div>
                        <div className="p-3 space-y-1.5">
                            {SUGGESTIONS.map((q) => (
                                <button
                                    key={q}
                                    onClick={() => handleSend(q)}
                                    className="w-full text-left text-xs text-gray-600 bg-gray-50 hover:bg-amber-50 hover:text-amber-700 border border-gray-100 hover:border-amber-200 rounded-lg px-3 py-2 transition-all"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* INDEX INFO */}
                    <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                            <FontAwesomeIcon icon={faDatabase} className="text-gray-400 text-xs" />
                            <h3 className="text-sm font-semibold text-gray-700">Thông tin Index</h3>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Trạng thái:</span>
                                <span className="flex items-center gap-1.5 text-green-600 font-medium">
                                    <span className="size-2 bg-green-500 rounded-full"></span>
                                    Đang hoạt động
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Vectors:</span>
                                <span className="font-medium text-gray-700">{indexSize ?? "..."}</span>
                            </div>
                            <div className="pt-2 border-t border-gray-100">
                                <button
                                    onClick={async () => {
                                        try {
                                            await chatbotAPI.reindex();
                                            alert("Reindex thành công!");
                                        } catch {
                                            alert("Lỗi reindex!");
                                        }
                                    }}
                                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition"
                                >
                                    <FontAwesomeIcon icon={faRotate} className="text-[10px]" />
                                    Reindex ngay
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* LOG */}
                    <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-700">Gợi ý kiểm tra</h3>
                        </div>
                        <div className="p-4 text-xs text-gray-500 space-y-2">
                            <p>✅ Kiểm tra giá sản phẩm cụ thể</p>
                            <p>✅ Kiểm tra "đắt nhất / rẻ nhất"</p>
                            <p>✅ Kiểm tra chính sách bảo hành</p>
                            <p>✅ Kiểm tra link sản phẩm trong nguồn</p>
                            <p>✅ Kiểm tra khi bot không có thông tin</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
