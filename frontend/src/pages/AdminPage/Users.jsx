import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faSearch, faUserShield, faSpinner, faUsers, faEnvelope, faCalendar, faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { useUsers } from "./hooks/useUsers";
import { formatDate } from "../../helpers/formatters";
import Button from "../../components/Button";
import Input from "../../components/Input";

export default function Users() {
    const { users, loading, refetching, updateUser, handleDelete, filteredUsers, searchTerm, setSearchTerm, showModal, editingUser, formData, setFormData, openModal, closeModal } = useUsers();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full size-10 sm:size-12 border-b-2 border-amber-400"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 sm:gap-3">
                <div className="size-9 sm:size-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                    <FontAwesomeIcon icon={faUsers} className="text-amber-600 text-sm sm:text-lg" />
                </div>
                <div>
                    <h1 className="text-base sm:text-2xl font-bold text-gray-900 whitespace-nowrap">Quản lý người dùng</h1>
                    <p className="text-[10px] sm:text-sm text-gray-500">{users.length} người dùng</p>
                </div>
            </div>

            <div className="rounded-xl bg-white shadow-sm border border-gray-100">
                <div className="p-3 sm:p-4 border-b border-gray-100">
                    <div className="relative max-w-md">
                        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm người dùng..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-10 text-sm outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-400/20 transition-all"
                        />
                        {refetching && (
                            <FontAwesomeIcon
                                icon={faSpinner}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400 animate-spin"
                            />
                        )}
                    </div>
                </div>

                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                <th className="py-3 px-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">STT</th>
                                <th className="py-3 px-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Tên</th>
                                <th className="py-3 px-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Email</th>
                                <th className="py-3 px-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Vai trò</th>
                                <th className="py-3 px-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Ngày tạo</th>
                                <th className="py-3 px-4 text-right text-[10px] font-semibold uppercase tracking-wider text-gray-500">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user, i) => (
                                <tr key={user._id} className={`border-b border-gray-50 last:border-0 hover:bg-amber-50/30 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}>
                                    <td className="py-3 px-4 text-sm text-gray-500">{i + 1}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600 shrink-0">
                                                {user.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-medium text-gray-800 text-sm">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-600">{user.email}</td>
                                    <td className="py-3 px-4">
                                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                            user.role === "admin" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"
                                        }`}>
                                            <FontAwesomeIcon icon={user.role === "admin" ? faUserShield : faShieldHalved} className="text-[10px]" />
                                            {user.role === "admin" ? "Admin" : "User"}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-500">
                                        {user.createdAt ? formatDate(user.createdAt) : "-"}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => openModal(user)} className="size-8 rounded-lg hover:bg-blue-50 text-blue-600 transition-all flex items-center justify-center" title="Sửa">
                                                <FontAwesomeIcon icon={faPen} className="text-xs" />
                                            </button>
                                            <button onClick={() => handleDelete(user._id)} className="size-8 rounded-lg hover:bg-red-50 text-red-500 transition-all flex items-center justify-center" title="Xóa">
                                                <FontAwesomeIcon icon={faTrash} className="text-xs" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-gray-400 text-sm">
                                        Không tìm thấy người dùng nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="md:hidden p-2 space-y-2">
                    {filteredUsers.length === 0 ? (
                        <div className="py-12 text-center text-gray-400 text-sm">
                            Không tìm thấy người dùng nào
                        </div>
                    ) : (
                        filteredUsers.map((user, i) => (
                            <div key={user._id} className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
                                <div className="p-3">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="size-10 rounded-full bg-gray-50 flex items-center justify-center text-sm font-bold text-gray-700 shrink-0 border border-gray-100">
                                                {user.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                                                <p className="text-[11px] text-gray-500 truncate flex items-center gap-1">
                                                    <FontAwesomeIcon icon={faEnvelope} className="text-[8px]" />
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-0.5 shrink-0">
                                            <button onClick={() => openModal(user)} className="size-7 rounded-lg hover:bg-blue-50 text-blue-600 flex items-center justify-center">
                                                <FontAwesomeIcon icon={faPen} className="text-[11px]" />
                                            </button>
                                            <button onClick={() => handleDelete(user._id)} className="size-7 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center">
                                                <FontAwesomeIcon icon={faTrash} className="text-[11px]" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                            user.role === "admin" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"
                                        }`}>
                                            <FontAwesomeIcon icon={user.role === "admin" ? faUserShield : faShieldHalved} className="text-[7px]" />
                                            {user.role === "admin" ? "Admin" : "User"}
                                        </span>
                                        {user.createdAt && (
                                            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                                <FontAwesomeIcon icon={faCalendar} className="text-[8px]" />
                                                {formatDate(user.createdAt)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="w-full sm:max-w-lg rounded-t-xl sm:rounded-xl bg-white shadow-xl">
                        <div className="flex items-center justify-between px-4 sm:px-6 pt-4 sm:pt-6 pb-2">
                            <div className="flex items-center gap-3">
                                <div className="size-9 rounded-lg bg-amber-100 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faUsers} className="text-amber-600 text-sm" />
                                </div>
                                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                                    Cập nhật người dùng
                                </h2>
                            </div>
                            <button type="button" onClick={closeModal} className="size-8 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-colors">
                                <span className="text-lg leading-none">&times;</span>
                            </button>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); updateUser(editingUser._id, formData); }} className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4">
                            <Input
                                label="Tên"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                            <Input
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Vai trò</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-400/20 transition-all"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
                                <Button variant="secondary" type="button" onClick={closeModal} className="w-full sm:w-auto">
                                    Hủy
                                </Button>
                                <Button type="submit" variant="primary" className="w-full sm:w-auto shadow-sm">
                                    Cập nhật
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
