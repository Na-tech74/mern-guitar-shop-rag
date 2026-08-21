import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faComments, faPaperPlane, faRobot, faXmark,
    faCircle, faUser, faTrash
} from "@fortawesome/free-solid-svg-icons";
import { chatbotAPI } from "../api";

const quickQuestions = [
    "Cửa hàng có bán guitar không?",
    "Giá guitar khoảng bao nhiêu?",
    "Chính sách bảo hành thế nào?",
];

const getMockReply = (input) => {
    const text = input.toLowerCase();

    if (/(xin ch|chào|hello|hi\b|hi$)/.test(text)) {
        return "Chào bạn! Mình là trợ lý ảo của Nam Acoustic Guitar Shop. Bạn cần tư vấn về sản phẩm, giá cả hay chính sách gì, cứ hỏi mình nhé!";
    }
    if (/gi[áà]|b[áà]o nhi[êe]u|r[ẻe]|đắt|ti[êe]n/.test(text)) {
        return "Cửa hàng có nhiều dòng guitar với mức giá đa dạng, từ vài triệu cho người mới đến dòng cao cấp hàng chục triệu. Bạn có thể vào mục Sản phẩm để lọc theo giá nhé!";
    }
    if (/s[ảa]n ph[ẩa]m|guitar|đàn|b[áà]n/.test(text)) {
        return "Cửa hàng đang bán các dòng Guitar Acoustic, Guitar Classic, Guitar Electric, phụ kiện và khóa học guitar. Bạn ghé trang Sản phẩm hoặc Khóa học để xem chi tiết từng loại nhé!";
    }
    if (/khuy[ếe]n m[ãa]i|gi[ảa]m gi[áà]|coupon|mã gi[ảa]m/.test(text)) {
        return "Hiện tại cửa hàng có nhiều mã giảm giá hấp dẫn. Bạn bấm vào chuông mã giảm giá ở góc phải trên để xem và sao chép mã nhé!";
    }
    if (/giao hàng|ship|v[ậa]n chuy[ểe]n|phí ship/.test(text)) {
        return "Cửa hàng miễn phí giao hàng cho đơn từ 500.000đ. Các đơn dưới mức đó sẽ tính phí theo khu vực giao hàng. Ngoài ra còn hỗ trợ đổi trả trong 7 ngày.";
    }
    if (/b[ảa]o h[àa]nh|đổi tr[ảa]|b[ảa]o v[ệe]/.test(text)) {
        return "Tất cả sản phẩm đều được bảo hành 12 tháng, chính hãng 100%. Bạn có thể đổi trả trong vòng 7 ngày nếu sản phẩm lỗi từ nhà sản xuất.";
    }
    if (/đơn hàng|theo dõi|tr[ạa]ng th[áa]i đơn/.test(text)) {
        return "Bạn vào mục Tài khoản > Đơn hàng của mình để theo dõi trạng thái đơn hàng. Nếu cần hỗ trợ thêm, bạn có thể liên hệ hotline của cửa hàng nhé!";
    }
    if (/li[êe]n h[ệe]|hotline|sdt|điện thoại|zalo|facebook/.test(text)) {
        return "Bạn có thể liên hệ cửa hàng qua trang Liên hệ để gửi tin nhắn, hoặc gọi hotline hiển thị trên trang. Cửa hàng rất vui được hỗ trợ bạn!";
    }
    if (/khóa h[ọo]c|h[ọo]c đàn|h[ọo]c guitar/.test(text)) {
        return "Cửa hàng có các khóa học guitar từ cơ bản đến nâng cao. Bạn vào mục Khóa học để xem lộ trình và đăng ký học nhé!";
    }
    if (/thanh toán|chuyển khoản|ti[ềe]n m[ặa]t|cod/.test(text)) {
        return "Cửa hàng hỗ trợ thanh toán khi nhận hàng (COD) và chuyển khoản ngân hàng. Tại bước thanh toán bạn chọn phương thức phù hợp nhé!";
    }
    if (/cảm ơn|thank|cám ơn/.test(text)) {
        return "Rất vui được hỗ trợ bạn! Nếu còn thắc mắc nào cứ hỏi mình tiếp nhé. Chúc bạn một ngày tốt lành!";
    }
    return "Mình chưa hiểu rõ câu hỏi của bạn. Bạn có thể thử hỏi về sản phẩm, giá cả, bảo hành, giao hàng, khuyến mãi hoặc khóa học nhé!";
};

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: "bot",
            text: "Xin chào! Mình là trợ lý của Nam Acoustic Guitar Shop. Bạn cần tư vấn gì về sản phẩm, giá cả hay chính sách của cửa hàng?",
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

        const userMsg = { role: "user", text };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setTyping(true);

        let reply;
        try {
            const { data } = await chatbotAPI.send(text);
            reply = data?.reply || getMockReply(text);
        } catch {
            reply = getMockReply(text);
        }

        setMessages((prev) => [...prev, { role: "bot", text: reply }]);
        setTyping(false);
    };

    const clearChat = () => {
        setMessages([
            {
                role: "bot",
                text: "Mình đã xóa hội thoại. Bạn cần tư vấn gì tiếp theo không?",
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
