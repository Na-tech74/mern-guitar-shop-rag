import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faSearch, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { useUsers } from "../hooks/useUsers";
import { formatDate } from "../../../helpers/format";
import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";

export default function Users() {
    const { users, loading, updateUser, deleteUser, filteredUsers, searchTerm, setSearchTerm } = useUsers();
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ name: "", email: "", role: "user" });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h1>
                    <p className="text-gray-500">Quản lý danh sách người dùng</p>
                </div>
            </div>

            <div className="rounded-xl bg-white p-4 shadow-sm">
                <div className="mb-4 flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm người dùng..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-amber-500"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="pb-3 text-left text-xs font-medium uppercase text-gray-500">STT</th>
                                <th className="pb-3 text-left text-xs font-medium uppercase text-gray-500">Tên</th>
                                <th className="pb-3 text-left text-xs font-medium uppercase text-gray-500">Email</th>
                                <th className="pb-3 text-left text-xs font-medium uppercase text-gray-500">Vai trò</th>
                                <th className="pb-3 text-left text-xs font-medium uppercase text-gray-500">Ngày tạo</th>
                                <th className="pb-3 text-right text-xs font-medium uppercase text-gray-500">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user, index) => (
                                <tr key={user._id} className="border-b border-gray-100 last:border-0">
                                    <td className="py-3 text-sm text-gray-600">{index + 1}</td>
                                    <td className="py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-amber-700">
                                                {user.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-medium text-gray-800">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 text-sm text-gray-600">{user.email}</td>
                                    <td className="py-3">
                                        <span className="bg-gray-200 rounded-full px-3 py-1 text-xs font-medium" >
                                            {user.role === "admin"
                                                ? (
                                                    <span>
                                                        <FontAwesomeIcon icon={faUserShield} className="text-[10px]" />
                                                        Admin
                                                    </span>
                                                )
                                                : "User"}
                                        </span>
                                    </td>
                                    <td className="py-3 text-sm text-gray-500">
                                        {user.createdAt ? formatDate(user.createdAt) : "-"}
                                    </td>
                                    <td className="py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => {
                                                setEditingUser(user);
                                                setFormData({ name: user.name, email: user.email, role: user.role || "user" });
                                                setShowModal(true);
                                            }}>
                                                <FontAwesomeIcon icon={faPen} />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => {
                                                if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
                                                    deleteUser(user._id);
                                                }
                                            }}>
                                                <FontAwesomeIcon icon={faTrash} className="text-red-600" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-gray-500">
                                        Không tìm thấy người dùng nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-lg rounded-xl bg-white p-6">
                        <h2 className="mb-4 text-xl font-semibold text-gray-800">
                            Cập nhật người dùng
                        </h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            updateUser(editingUser._id, formData);
                            setShowModal(false);
                        }} className="space-y-4">
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
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-amber-500"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="secondary" type="button" onClick={() => { setShowModal(false); setEditingUser(null); }}>
                                    Hủy
                                </Button>
                                <Button type="submit" variant="primary">
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