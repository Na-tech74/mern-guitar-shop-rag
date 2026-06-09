import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser, faEnvelope, faShieldHalved, faCalendarDays,
    faPenToSquare, faCheck, faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "../../helpers/formatters";
import useProfileTab from "./hooks/useProfileTab";

export default function ProfileTab({ profile, userInfo, onSaved, showToast }) {
    const {
        form, errors, editing, saving,
        setEditing, updateField, handleSave, handleCancel,
    } = useProfileTab(profile, userInfo, onSaved, showToast);

    return (
        <div className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Thông tin cá nhân</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Cập nhật thông tin của bạn</p>
                </div>
                {!editing && (
                    <button
                        type="button"
                        onClick={() => setEditing(true)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 text-sm font-medium transition"
                    >
                        <FontAwesomeIcon icon={faPenToSquare} className="text-xs" />
                        Chỉnh sửa
                    </button>
                )}
            </div>

            <div className="p-4 sm:p-5 space-y-4">
                <Field
                    label="Họ và tên"
                    icon={faUser}
                    value={form.name}
                    onChange={updateField("name")}
                    error={errors.name}
                    disabled={!editing}
                />
                <Field
                    label="Email"
                    icon={faEnvelope}
                    type="email"
                    value={form.email}
                    onChange={updateField("email")}
                    error={errors.email}
                    disabled={!editing}
                />
                <Field
                    label="Vai trò"
                    icon={faShieldHalved}
                    value={profile?.role === "admin" || userInfo?.role === "admin" ? "Quản trị viên" : "Người dùng"}
                    disabled
                />
                {profile?.createdAt && (
                    <Field
                        label="Ngày tham gia"
                        icon={faCalendarDays}
                        value={formatDate(profile.createdAt)}
                        disabled
                    />
                )}
            </div>

            {editing && (
                <div className="flex items-center justify-end gap-2 p-4 sm:p-5 border-t border-gray-100 bg-gray-50/50">
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 text-sm font-medium transition disabled:opacity-50"
                    >
                        <FontAwesomeIcon icon={faXmark} className="text-xs" />
                        Hủy
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium transition disabled:opacity-50"
                    >
                        {saving ? (
                            <span className="size-3 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                        ) : (
                            <FontAwesomeIcon icon={faCheck} className="text-xs" />
                        )}
                        Lưu thay đổi
                    </button>
                </div>
            )}
        </div>
    );
}

function Field({ label, icon, value, onChange, error, disabled, type = "text" }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <FontAwesomeIcon icon={icon} className="text-sm" />
                    </div>
                )}
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    disabled={disabled}
                    className={`w-full ${icon ? "pl-10" : "pl-4"} pr-4 py-2.5 rounded-lg border text-sm transition ${
                        error
                            ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                            : disabled
                                ? "bg-gray-50 border-gray-200 text-gray-500"
                                : "bg-white border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                    } outline-none disabled:cursor-not-allowed`}
                />
            </div>
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
    );
}
