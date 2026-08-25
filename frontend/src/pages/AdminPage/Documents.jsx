import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faPen, faFileLines, faTimes, faSearch, faRotate, faBook, faQuestionCircle, faShieldAlt, faClipboardList, faBox, faImage, faFile } from "@fortawesome/free-solid-svg-icons";
import { formatDateTime, formatCurrency } from "../../helpers/formatters";
import useDocuments from "./hooks/useDocuments";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { useState, useEffect, useCallback } from "react";
import { productAPI, chatbotAPI } from "../../api";

const TYPE_LABELS = { product_guide: "Hướng dẫn SP", faq: "FAQ", policy: "Chính sách", manual: "Hướng dẫn" };
const STATUS_LABELS = { active: "Đang dùng", hidden: "Ẩn", needs_update: "Cần cập nhật" };
const TYPE_ICONS = { product_guide: faBook, faq: faQuestionCircle, policy: faShieldAlt, manual: faClipboardList };

export default function Documents() {
    const { documents, loading, error, setError, showForm, editingDoc, formData, setFormData, reindexing, handleSubmit, handleEdit, handleDelete, resetForm, openForm, reindex } = useDocuments();
    const [tab, setTab] = useState("documents");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(false);
    const [productSearch, setProductSearch] = useState("");

    const [policyFiles, setPolicyFiles] = useState([]);
    const [policyLoading, setPolicyLoading] = useState(false);
    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const [policyContent, setPolicyContent] = useState("");
    const [policyContentLoading, setPolicyContentLoading] = useState(false);

    const fetchProducts = useCallback(async () => {
        setProductsLoading(true);
        try {
            const res = await productAPI.getAll({ limit: 200 });
            setProducts(res.data?.data?.products || []);
        } catch {
            setProducts([]);
        } finally {
            setProductsLoading(false);
        }
    }, []);

    const fetchPolicyFiles = useCallback(async () => {
        setPolicyLoading(true);
        try {
            const res = await chatbotAPI.getPolicyFiles();
            setPolicyFiles(res.data?.data?.files || []);
        } catch {
            setPolicyFiles([]);
        } finally {
            setPolicyLoading(false);
        }
    }, []);

    const viewPolicyFile = async (filename) => {
        setSelectedPolicy(filename);
        setPolicyContentLoading(true);
        try {
            const res = await chatbotAPI.getPolicyFile(filename);
            setPolicyContent(res.data?.data?.content || "");
        } catch {
            setPolicyContent("Không thể đọc nội dung file.");
        } finally {
            setPolicyContentLoading(false);
        }
    };

    useEffect(() => {
        if (tab === "products") {
            fetchProducts();
            fetchPolicyFiles();
        }
    }, [tab, fetchProducts, fetchPolicyFiles]);

    const filteredDocs = documents.filter(d =>
        (!searchTerm || d.document_id?.toLowerCase().includes(searchTerm.toLowerCase()) || d.title?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (!filterType || d.type === filterType) &&
        (!filterStatus || d.status === filterStatus)
    );

    const filteredProducts = products.filter(p =>
        !productSearch ||
        p.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.category?.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.brand?.name?.toLowerCase().includes(productSearch.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full size-10 sm:size-12 border-b-2 border-amber-400"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="size-9 sm:size-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                        <FontAwesomeIcon icon={faFileLines} className="text-amber-600 text-sm sm:text-lg" />
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-base sm:text-2xl font-bold text-gray-900 whitespace-nowrap">Kiến thức Chatbot</h1>
                        <p className="text-[10px] sm:text-sm text-gray-500">{documents.length} tài liệu · {products.length + policyFiles.length} dữ liệu index</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <Button onClick={reindex} variant="secondary" size="sm" className="shadow-sm" disabled={reindexing}>
                        <FontAwesomeIcon icon={faRotate} className={reindexing ? "animate-spin" : ""} />
                        Reindex
                    </Button>
                    {tab === "documents" && (
                        <Button onClick={openForm} variant="primary" size="sm" className="shadow-sm">
                            <FontAwesomeIcon icon={faPlus} />
                            Thêm tài liệu
                        </Button>
                    )}
                </div>
            </div>

            {error && (
                <div className="flex items-center justify-between rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                    <span className="text-sm text-red-700">{error}</span>
                    <button type="button" onClick={() => setError(null)} className="size-7 rounded-md hover:bg-red-100 text-red-500 flex items-center justify-center shrink-0">
                        <FontAwesomeIcon icon={faTimes} className="text-xs" />
                    </button>
                </div>
            )}

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-xl sm:rounded-xl bg-white shadow-xl">
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between rounded-t-xl z-10">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="size-8 sm:size-9 rounded-lg bg-amber-100 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faFileLines} className="text-amber-600 text-xs sm:text-sm" />
                                </div>
                                <h2 className="text-sm sm:text-lg font-semibold text-gray-800">
                                    {editingDoc ? "Sửa tài liệu" : "Thêm tài liệu"}
                                </h2>
                            </div>
                            <button type="button" onClick={resetForm} className="size-8 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-colors">
                                <span className="text-lg leading-none">&times;</span>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
                            <Input label="Mã tài liệu" value={formData.document_id} onChange={(e) => setFormData({ ...formData, document_id: e.target.value })} required />
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Loại <span className="text-red-500">*</span></label>
                                <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-400/20 transition" required>
                                    <option value="">Chọn loại</option>
                                    <option value="product_guide">Hướng dẫn SP</option>
                                    <option value="faq">FAQ</option>
                                    <option value="policy">Chính sách</option>
                                    <option value="manual">Hướng dẫn</option>
                                </select>
                            </div>
                            <Input label="Tiêu đề" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Nội dung <span className="text-red-500">*</span></label>
                                <textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-mono outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-400/20 transition" rows={10} placeholder="Nội dung sẽ được chia nhỏ và mã hóa thành vectors cho chatbot..." required />
                                <p className="text-xs text-gray-400 mt-1">Nhớ bấm Reindex sau khi lưu</p>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Trạng thái <span className="text-red-500">*</span></label>
                                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-400/20 transition" required>
                                    <option value="">Chọn trạng thái</option>
                                    <option value="active">Đang dùng</option>
                                    <option value="hidden">Ẩn</option>
                                    <option value="needs_update">Cần cập nhật</option>
                                </select>
                            </div>
                            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
                                <Button type="button" variant="secondary" onClick={resetForm} className="w-full sm:w-auto">Hủy</Button>
                                <Button type="submit" variant="primary" className="w-full sm:w-auto shadow-sm">{editingDoc ? "Lưu" : "Thêm"}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                <button onClick={() => setTab("documents")} className={`flex-1 flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${tab === "documents" ? "bg-white text-amber-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                    <FontAwesomeIcon icon={faFileLines} className="text-xs" />
                    Tài liệu ({documents.length})
                </button>
                <button onClick={() => setTab("products")} className={`flex-1 flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${tab === "products" ? "bg-white text-amber-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                    <FontAwesomeIcon icon={faBox} className="text-xs" />
                    Dữ liệu index ({products.length + policyFiles.length})
                </button>
            </div>

            {tab === "documents" ? (
                <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-3 sm:p-4 border-b border-gray-100">
                        <div className="flex flex-col sm:flex-row gap-2">
                            <div className="relative flex-1 max-w-md">
                                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="text" placeholder="Tìm kiếm tài liệu..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-10 text-sm outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-400/20 transition-all" />
                            </div>
                            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-amber-400 transition-all">
                                <option value="">Tất cả loại</option>
                                <option value="product_guide">Hướng dẫn SP</option>
                                <option value="faq">FAQ</option>
                                <option value="policy">Chính sách</option>
                                <option value="manual">Hướng dẫn</option>
                            </select>
                            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-amber-400 transition-all">
                                <option value="">Tất cả trạng thái</option>
                                <option value="active">Đang dùng</option>
                                <option value="hidden">Ẩn</option>
                                <option value="needs_update">Cần cập nhật</option>
                            </select>
                        </div>
                    </div>

                    {documents.length === 0 ? (
                        <div className="py-12 sm:py-16 text-center">
                            <div className="size-12 sm:size-16 mx-auto mb-3 sm:mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                <FontAwesomeIcon icon={faFileLines} className="text-xl sm:text-2xl text-gray-400" />
                            </div>
                            <p className="text-gray-500 text-sm">Chưa có tài liệu nào</p>
                        </div>
                    ) : filteredDocs.length === 0 ? (
                        <div className="py-12 text-center text-gray-400 text-sm">Không tìm thấy tài liệu nào</div>
                    ) : (
                        <>
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-100 bg-gray-50/50">
                                            <th className="py-3 px-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Mã</th>
                                            <th className="py-3 px-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Tiêu đề</th>
                                            <th className="py-3 px-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Loại</th>
                                            <th className="py-3 px-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Trạng thái</th>
                                            <th className="py-3 px-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Ngày tạo</th>
                                            <th className="py-3 px-4 text-right text-[10px] font-semibold uppercase tracking-wider text-gray-500">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredDocs.map((doc, i) => (
                                            <tr key={doc._id} className={`border-b border-gray-50 last:border-0 hover:bg-amber-50/30 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}>
                                                <td className="py-3 px-4"><span className="text-sm font-mono text-gray-700">{doc.document_id}</span></td>
                                                <td className="py-3 px-4"><p className="font-medium text-gray-800 text-sm truncate max-w-[250px]">{doc.title}</p></td>
                                                <td className="py-3 px-4">
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                                                        <FontAwesomeIcon icon={TYPE_ICONS[doc.type] || faFileLines} className="text-[10px]" />
                                                        {TYPE_LABELS[doc.type] || doc.type}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${doc.status === "active" ? "bg-green-100 text-green-700" : doc.status === "hidden" ? "bg-gray-100 text-gray-600" : "bg-orange-100 text-orange-700"}`}>
                                                        {STATUS_LABELS[doc.status] || doc.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4"><span className="text-sm text-gray-500">{doc.createdAt ? formatDateTime(doc.createdAt) : "-"}</span></td>
                                                <td className="py-3 px-4 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <button onClick={() => handleEdit(doc)} className="size-8 rounded-lg hover:bg-blue-50 text-blue-600 transition-all flex items-center justify-center" title="Sửa"><FontAwesomeIcon icon={faPen} className="text-xs" /></button>
                                                        <button onClick={() => handleDelete(doc._id)} className="size-8 rounded-lg hover:bg-red-50 text-red-500 transition-all flex items-center justify-center" title="Xóa"><FontAwesomeIcon icon={faTrash} className="text-xs" /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="md:hidden p-2 space-y-2">
                                {filteredDocs.map((doc) => (
                                    <div key={doc._id} className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
                                        <div className="p-3">
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2">{doc.title}</p>
                                                    <p className="text-[11px] text-gray-500 truncate mt-0.5 font-mono">{doc.document_id}</p>
                                                </div>
                                                <div className="flex gap-0.5 shrink-0">
                                                    <button onClick={() => handleEdit(doc)} className="size-7 rounded-lg hover:bg-blue-50 text-blue-600 flex items-center justify-center"><FontAwesomeIcon icon={faPen} className="text-[11px]" /></button>
                                                    <button onClick={() => handleDelete(doc._id)} className="size-7 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center"><FontAwesomeIcon icon={faTrash} className="text-[11px]" /></button>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                                                    <FontAwesomeIcon icon={TYPE_ICONS[doc.type] || faFileLines} className="text-[8px]" />
                                                    {TYPE_LABELS[doc.type] || doc.type}
                                                </span>
                                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${doc.status === "active" ? "bg-green-100 text-green-700" : doc.status === "hidden" ? "bg-gray-100 text-gray-600" : "bg-orange-100 text-orange-700"}`}>
                                                    {STATUS_LABELS[doc.status] || doc.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {/* POLICY FILES */}
                    <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-3 sm:p-4 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faFile} className="text-purple-500" />
                                <h3 className="text-sm font-semibold text-gray-700">File chính sách (bot/data/)</h3>
                                <span className="text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{policyFiles.length} file</span>
                            </div>
                        </div>
                        {policyLoading ? (
                            <div className="py-8 text-center"><div className="animate-spin rounded-full size-6 border-b-2 border-amber-400 mx-auto"></div></div>
                        ) : policyFiles.length === 0 ? (
                            <div className="py-8 text-center text-gray-400 text-sm">Không tìm thấy file chính sách nào trong bot/data/</div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {policyFiles.map((f) => (
                                    <div key={f.filename} className="px-4 py-3 hover:bg-amber-50/30 transition-colors cursor-pointer" onClick={() => viewPolicyFile(f.filename)}>
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="size-8 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                                                    <FontAwesomeIcon icon={faFileLines} className="text-purple-600 text-xs" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-gray-800 truncate">{f.title}</p>
                                                    <p className="text-[11px] text-gray-400 font-mono">{f.filename} · {f.lines} dòng</p>
                                                </div>
                                            </div>
                                            <span className="text-[11px] text-gray-400 shrink-0">{(f.size / 1024).toFixed(1)} KB</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {selectedPolicy && (
                        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm">
                            <div className="w-full sm:max-w-2xl max-h-[80vh] overflow-y-auto rounded-t-xl sm:rounded-xl bg-white shadow-xl">
                                <div className="sticky top-0 bg-white border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center justify-between z-10">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <FontAwesomeIcon icon={faFileLines} className="text-purple-500" />
                                        <h3 className="text-sm font-semibold text-gray-800 truncate">{selectedPolicy}</h3>
                                    </div>
                                    <button onClick={() => { setSelectedPolicy(null); setPolicyContent(""); }} className="size-8 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 flex items-center justify-center"><FontAwesomeIcon icon={faTimes} /></button>
                                </div>
                                <div className="p-4 sm:p-6">
                                    {policyContentLoading ? (
                                        <div className="py-8 text-center"><div className="animate-spin rounded-full size-6 border-b-2 border-amber-400 mx-auto"></div></div>
                                    ) : (
                                        <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono bg-gray-50 rounded-lg p-4 max-h-[60vh] overflow-y-auto">{policyContent}</pre>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PRODUCTS */}
                    <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-3 sm:p-4 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faBox} className="text-amber-500" />
                                <h3 className="text-sm font-semibold text-gray-700">Sản phẩm</h3>
                                <span className="text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{products.length} SP</span>
                            </div>
                            <div className="relative max-w-xs">
                                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="text" placeholder="Tìm sản phẩm..." value={productSearch} onChange={(e) => setProductSearch(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-8 pr-3 text-xs outline-none focus:border-amber-400 focus:bg-white transition-all" />
                            </div>
                        </div>

                        {productsLoading ? (
                            <div className="py-12 text-center"><div className="animate-spin rounded-full size-8 border-b-2 border-amber-400 mx-auto"></div><p className="text-gray-400 text-sm mt-2">Đang tải...</p></div>
                        ) : products.length === 0 ? (
                            <div className="py-12 text-center"><FontAwesomeIcon icon={faBox} className="text-3xl text-gray-300 mb-2" /><p className="text-gray-500 text-sm">Chưa có sản phẩm</p></div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="py-8 text-center text-gray-400 text-sm">Không tìm thấy sản phẩm</div>
                        ) : (
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-100 bg-gray-50/50">
                                            <th className="py-3 px-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Ảnh</th>
                                            <th className="py-3 px-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Tên sản phẩm</th>
                                            <th className="py-3 px-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Danh mục</th>
                                            <th className="py-3 px-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Thương hiệu</th>
                                            <th className="py-3 px-4 text-right text-[10px] font-semibold uppercase tracking-wider text-gray-500">Giá</th>
                                            <th className="py-3 px-4 text-right text-[10px] font-semibold uppercase tracking-wider text-gray-500">Tồn kho</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProducts.map((p, i) => (
                                            <tr key={p._id} className={`border-b border-gray-50 last:border-0 hover:bg-amber-50/30 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}>
                                                <td className="py-3 px-4">
                                                    <div className="size-10 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                                                        {p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" loading="lazy" /> : <div className="w-full h-full flex items-center justify-center text-gray-300"><FontAwesomeIcon icon={faImage} /></div>}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <p className="font-medium text-gray-800 text-sm truncate max-w-[250px]">{p.name}</p>
                                                    <p className="text-[11px] text-gray-400">Đã bán: {p.sold || 0}</p>
                                                </td>
                                                <td className="py-3 px-4"><span className="text-sm text-gray-600">{p.category?.name || "-"}</span></td>
                                                <td className="py-3 px-4"><span className="text-sm text-gray-600">{p.brand?.name || "-"}</span></td>
                                                <td className="py-3 px-4 text-right">
                                                    <span className="text-sm font-semibold text-amber-600">{formatCurrency(p.price)}</span>
                                                    {p.originalPrice > p.price && <p className="text-[11px] text-gray-400 line-through">{formatCurrency(p.originalPrice)}</p>}
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <span className={`text-sm font-medium ${p.stock > 0 ? "text-green-600" : "text-red-500"}`}>{p.stock > 0 ? `${p.stock} cái` : "Hết hàng"}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        <div className="p-3 border-t border-gray-100 bg-gray-50/50">
                            <p className="text-[11px] text-gray-400 text-center">Sản phẩm & file chính sách được tự động index khi chạy <code className="bg-gray-200 px-1 rounded">python indexer.py</code></p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
