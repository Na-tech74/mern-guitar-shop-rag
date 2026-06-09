import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import usePasswordTab from "./hooks/usePasswordTab";

export default function PasswordTab({ showToast, onChanged }) {
    const {
        form, errors, saving, showCurrent, showNew,
        setShowCurrent, setShowNew, updateField, handleSubmit,
    } = usePasswordTab(showToast, onChanged);

    return (
        <div className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Đổi mật khẩu</h2>
                <p className="text-sm text-gray-500 mt-0.5">Sau khi đổi, bạn sẽ được đăng xuất và cần đăng nhập lại</p>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
                <PasswordField
                    label="Mật khẩu hiện tại"
                    value={form.currentPassword}
                    onChange={updateField("currentPassword")}
                    error={errors.currentPassword}
                    show={showCurrent}
                    onToggle={() => setShowCurrent(!showCurrent)}
                />
                <PasswordField
                    label="Mật khẩu mới"
                    value={form.newPassword}
                    onChange={updateField("newPassword")}
                    error={errors.newPassword}
                    show={showNew}
                    onToggle={() => setShowNew(!showNew)}
                    hint="Ít nhất 8 ký tự, có chữ hoa, chữ thường và số"
                />
                <PasswordField
                    label="Xác nhận mật khẩu mới"
                    value={form.confirmPassword}
                    onChange={updateField("confirmPassword")}
                    error={errors.confirmPassword}
                    show={showNew}
                    onToggle={() => setShowNew(!showNew)}
                />

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition disabled:opacity-50 shadow-soft"
                    >
                        {saving ? (
                            <span className="size-3 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                        ) : (
                            <FontAwesomeIcon icon={faKey} className="text-xs" />
                        )}
                        Đổi mật khẩu
                    </button>
                </div>
            </form>
        </div>
    );
}

function PasswordField({ label, value, onChange, error, show, onToggle, hint }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FontAwesomeIcon icon={faKey} className="text-sm" />
                </div>
                <input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full pl-10 pr-10 py-2.5 rounded-lg border text-sm transition outline-none ${
                        error
                            ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                            : "bg-white border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                    }`}
                />
                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                >
                    <FontAwesomeIcon icon={show ? faEyeSlash : faEye} className="text-sm" />
                </button>
            </div>
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
            {hint && !error && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
        </div>
    );
}
