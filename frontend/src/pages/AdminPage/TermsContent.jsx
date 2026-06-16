import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFileContract, faCheckCircle, faExclamationCircle,
    faPlus, faTrash, faArrowUp, faArrowDown, faEye,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Input from "../../components/Input";
import Textarea from "../../components/Textarea";
import Button from "../../components/Button";
import { useTermsContent } from "./hooks/useTermsContent";

const MessageBanner = ({ message }) => {
    if (!message) return null;
    const isError = message.type === "error";
    return (
        <div className={`flex items-start gap-2 rounded-lg border px-4 py-3 text-sm ${isError ? "border-red-200 bg-red-50 text-red-700" : "border-green-200 bg-green-50 text-green-700"}`}>
            <FontAwesomeIcon icon={isError ? faExclamationCircle : faCheckCircle} className="mt-0.5 shrink-0" />
            <span>{message.text}</span>
        </div>
    );
};

const SectionTitle = ({ children, hint }) => (
    <div className="mb-4 pl-3 border-l-4 border-amber-400">
        <h3 className="text-sm font-semibold text-gray-800">{children}</h3>
        {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
);

export default function TermsContent() {
    const {
        loading, saving, formData, message,
        updateHeader, updateSection, addSection, removeSection, moveSection,
        handleSubmit,
    } = useTermsContent();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full size-10 sm:size-12 border-b-2 border-amber-400" />
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="size-9 sm:size-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                        <FontAwesomeIcon icon={faFileContract} className="text-amber-600 text-sm sm:text-lg" />
                    </div>
                    <div>
                        <h1 className="text-base sm:text-2xl font-bold text-gray-900">Điều khoản & Bảo mật</h1>
                        <p className="text-[10px] sm:text-sm text-gray-500">Quản lý nội dung trang điều khoản và bảo mật</p>
                    </div>
                </div>
                <Link to="/terms" target="_blank" className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm text-amber-600 hover:text-amber-700 font-medium rounded-lg hover:bg-amber-50 transition-colors">
                    <FontAwesomeIcon icon={faEye} />
                    Xem trang
                </Link>
            </div>

            <MessageBanner message={message} />

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="rounded-xl bg-white shadow-sm border border-gray-100 p-4 sm:p-6">
                    <SectionTitle>Tiêu đề trang</SectionTitle>
                    <div className="space-y-4">
                        <Input
                            label="Tiêu đề"
                            value={formData.header.title}
                            onChange={(e) => updateHeader("title", e.target.value)}
                        />
                        <Input
                            label="Ngày cập nhật"
                            value={formData.header.lastUpdated}
                            onChange={(e) => updateHeader("lastUpdated", e.target.value)}
                            placeholder="VD: 01/01/2026"
                        />
                    </div>
                </div>

                <div className="rounded-xl bg-white shadow-sm border border-gray-100 p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                        <SectionTitle hint="Thêm các mục điều khoản, chính sách">
                            Nội dung
                        </SectionTitle>
                        <Button type="button" variant="outline" size="sm" onClick={addSection}>
                            <FontAwesomeIcon icon={faPlus} />
                            Thêm mục
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {formData.sections.map((section, i) => (
                            <div key={i} className="rounded-lg border border-gray-200 p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-medium text-gray-400">Mục {i + 1}</span>
                                    <div className="flex items-center gap-1">
                                        <button type="button" onClick={() => moveSection(i, -1)} disabled={i === 0} className="size-7 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30 flex items-center justify-center">
                                            <FontAwesomeIcon icon={faArrowUp} className="text-xs" />
                                        </button>
                                        <button type="button" onClick={() => moveSection(i, 1)} disabled={i === formData.sections.length - 1} className="size-7 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30 flex items-center justify-center">
                                            <FontAwesomeIcon icon={faArrowDown} className="text-xs" />
                                        </button>
                                        <button type="button" onClick={() => removeSection(i)} disabled={formData.sections.length <= 1} className="size-7 rounded-lg hover:bg-red-50 text-red-400 disabled:opacity-30 flex items-center justify-center">
                                            <FontAwesomeIcon icon={faTrash} className="text-xs" />
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Input
                                        label="Tiêu đề mục"
                                        value={section.title}
                                        onChange={(e) => updateSection(i, "title", e.target.value)}
                                        placeholder="VD: 1. Chính sách bảo mật thông tin"
                                    />
                                    <Textarea
                                        label="Nội dung"
                                        value={section.content}
                                        onChange={(e) => updateSection(i, "content", e.target.value)}
                                        rows={6}
                                        placeholder="Nhập nội dung điều khoản..."
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button type="submit" variant="primary" loading={saving} className="shadow-sm">
                        {saving ? "Đang lưu..." : "Lưu thay đổi"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
