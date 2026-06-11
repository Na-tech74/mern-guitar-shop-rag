import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import Input from "../../components/Input";
import Textarea from "../../components/Textarea";
import Button from "../../components/Button";
import { useContactContent } from "./hooks/useContactContent";

const iconLabels = {
    map: "Bản đồ",
    phone: "Điện thoại",
    email: "Email",
    clock: "Đồng hồ",
};

export default function ContactContent() {
    const { content, loading, saving, message, update, updateContactInfo, save } = useContactContent();

    if (loading) {
        return (
            <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full size-10 border-b-2 border-amber-400" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-900">Nội dung trang Liên hệ</h1>
                <Button variant="primary" size="sm" onClick={save} loading={saving}>
                    Lưu thay đổi
                </Button>
            </div>

            {message && (
                <div className={`flex items-start gap-2 rounded-lg border px-4 py-3 text-sm ${message.type === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-green-200 bg-green-50 text-green-700"}`}>
                    <FontAwesomeIcon icon={message.type === "error" ? faExclamationCircle : faCheckCircle} className="mt-0.5 shrink-0" />
                    <span>{message.text}</span>
                </div>
            )}

            <Section title="Tiêu đề & mô tả" hint="Phần header đầu trang liên hệ">
                <Input label="Tiêu đề" value={content.header?.title || ""} onChange={(e) => update("header.title", e.target.value)} />
                <Textarea label="Mô tả" rows={2} value={content.header?.subtitle || ""} onChange={(e) => update("header.subtitle", e.target.value)} />
            </Section>

            <Section title="Thông tin liên hệ" hint="4 mục hiển thị bên trái form">
                <div className="space-y-4">
                    {(content.contactInfo || []).map((item, index) => (
                        <div key={index} className="rounded-lg border border-gray-200 p-4 space-y-3">
                            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <span className="size-2 rounded-full bg-amber-400" />
                                {iconLabels[item.icon] || item.icon}
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Icon</label>
                                    <select value={item.icon} onChange={(e) => updateContactInfo(index, "icon", e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-amber-500 bg-white">
                                        {Object.entries(iconLabels).map(([val, label]) => (
                                            <option key={val} value={val}>{label}</option>
                                        ))}
                                    </select>
                                </div>
                                <Input label="Nhãn" value={item.label} onChange={(e) => updateContactInfo(index, "label", e.target.value)} />
                            </div>
                            <Input label="Giá trị" value={item.value} onChange={(e) => updateContactInfo(index, "value", e.target.value)} />
                        </div>
                    ))}
                </div>
            </Section>

            <Section title="Mạng xã hội" hint="Link đến các trang mạng xã hội">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Facebook URL" value={content.socialLinks?.facebook || ""} onChange={(e) => update("socialLinks.facebook", e.target.value)} />
                    <Input label="Instagram URL" value={content.socialLinks?.instagram || ""} onChange={(e) => update("socialLinks.instagram", e.target.value)} />
                    <Input label="YouTube URL" value={content.socialLinks?.youtube || ""} onChange={(e) => update("socialLinks.youtube", e.target.value)} />
                </div>
            </Section>

            <Section title="Google Maps" hint="URL embed từ Google Maps">
                <Textarea rows={2} value={content.mapEmbedUrl || ""} onChange={(e) => update("mapEmbedUrl", e.target.value)} />
            </Section>

            <div className="flex justify-end pb-8">
                <Button variant="primary" size="sm" onClick={save} loading={saving}>
                    Lưu thay đổi
                </Button>
            </div>
        </div>
    );
}

function Section({ title, hint, children }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <div className="pl-3 border-l-4 border-amber-400">
                <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
                {hint && <p className="text-xs text-gray-500 mt-0.5">{hint}</p>}
            </div>
            {children}
        </div>
    );
}
