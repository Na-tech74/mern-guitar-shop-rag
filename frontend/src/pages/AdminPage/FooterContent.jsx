import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle, faCheckCircle, faPlus, faTrash, faLink } from "@fortawesome/free-solid-svg-icons";
import Input from "../../components/Input";
import Textarea from "../../components/Textarea";
import Button from "../../components/Button";
import { useFooterContent } from "./hooks/useFooterContent";

export default function FooterContent() {
    const { content, loading, saving, message, update, updateArrayItem, addArrayItem, removeArrayItem, save } = useFooterContent();

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
                <h1 className="text-xl font-bold text-gray-900">Nội dung Footer</h1>
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

            <Section title="Mô tả" hint="Đoạn văn giới thiệu ngắn về shop">
                <Textarea value={content.description} onChange={(e) => update("description", e.target.value)} rows={3} />
            </Section>

            <Section title="Thông tin liên hệ">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Địa chỉ" value={content.contactInfo?.address || ""} onChange={(e) => update("contactInfo.address", e.target.value)} />
                    <Input label="Số điện thoại" value={content.contactInfo?.phone || ""} onChange={(e) => update("contactInfo.phone", e.target.value)} />
                    <Input label="Email" value={content.contactInfo?.email || ""} onChange={(e) => update("contactInfo.email", e.target.value)} />
                    <Input label="Giờ làm việc" value={content.contactInfo?.hours || ""} onChange={(e) => update("contactInfo.hours", e.target.value)} />
                </div>
            </Section>

            <Section title="Mạng xã hội" hint="Link đến các trang mạng xã hội">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Facebook" value={content.socialLinks?.facebook || ""} onChange={(e) => update("socialLinks.facebook", e.target.value)} />
                    <Input label="Instagram" value={content.socialLinks?.instagram || ""} onChange={(e) => update("socialLinks.instagram", e.target.value)} />
                    <Input label="YouTube" value={content.socialLinks?.youtube || ""} onChange={(e) => update("socialLinks.youtube", e.target.value)} />
                    <Input label="TikTok" value={content.socialLinks?.tiktok || ""} onChange={(e) => update("socialLinks.tiktok", e.target.value)} />
                </div>
            </Section>

            <Section title="Danh mục" hint="Liên kết danh mục trong footer">
                <LinkList items={content.categories || []} onChange={(index, key, value) => updateArrayItem("categories", index, key, value)}
                    onAdd={() => addArrayItem("categories", { label: "", path: "" })} onRemove={(i) => removeArrayItem("categories", i)} />
            </Section>

            <Section title="Liên kết hỗ trợ">
                <LinkList items={content.supportLinks || []} onChange={(index, key, value) => updateArrayItem("supportLinks", index, key, value)}
                    onAdd={() => addArrayItem("supportLinks", { label: "", path: "" })} onRemove={(i) => removeArrayItem("supportLinks", i)} />
            </Section>

            <Section title="Thanh dưới cùng (Bottom Bar)">
                <Textarea label="Nội dung bản quyền" value={content.bottomBar?.copyrightText || ""} onChange={(e) => update("bottomBar.copyrightText", e.target.value)} rows={2} />
                <div className="flex items-center gap-6 mt-3">
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" checked={content.bottomBar?.showTerms || false} onChange={(e) => update("bottomBar.showTerms", e.target.checked)} className="text-amber-500" />
                        Hiển thị "Điều khoản"
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" checked={content.bottomBar?.showPrivacy || false} onChange={(e) => update("bottomBar.showPrivacy", e.target.checked)} className="text-amber-500" />
                        Hiển thị "Bảo mật"
                    </label>
                </div>
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

function LinkList({ items, onChange, onAdd, onRemove }) {
    return (
        <div className="space-y-3">
            {items.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input placeholder="Tên hiển thị" value={item.label} onChange={(e) => onChange(index, "label", e.target.value)} />
                        <div className="relative">
                            <Input placeholder="/duong-dan" value={item.path} onChange={(e) => onChange(index, "path", e.target.value)} />
                            <FontAwesomeIcon icon={faLink} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                        </div>
                    </div>
                    <button type="button" onClick={() => onRemove(index)} className="mt-2 size-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600 transition">
                        <FontAwesomeIcon icon={faTrash} className="text-xs" />
                    </button>
                </div>
            ))}
            <button type="button" onClick={onAdd} className="flex items-center gap-2 text-sm text-amber-500 hover:text-amber-600 font-medium transition">
                <FontAwesomeIcon icon={faPlus} className="text-xs" />
                Thêm liên kết
            </button>
        </div>
    );
}
