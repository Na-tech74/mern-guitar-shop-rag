import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faMinus, faPlus, faShoppingCart, faTruck, faShieldAlt, faUndo, faImage, faCheck, faXmark, faChevronLeft, faChevronRight, faStar, faUser, faTrash, faPenToSquare, faTrademark, faGlobe, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { productAPI, reviewAPI } from "../../api";
import { formatCurrency, formatDateTime } from "../../helpers/formatters";
import { getOptimizedImage } from "../../helpers/image";
import { nl2br } from "../../helpers/nl2br";
import Skeleton from "../../components/Skeleton";
import StarRating from "../../components/StarRating";
import useCart from "./hooks/useCart";

export default function ProductDetailPage() {
    
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const { addToCart, addedMap } = useCart();
    const [inWishlist, setInWishlist] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [reviewsLoaded, setReviewsLoaded] = useState(false);
    const [reviewForm, setReviewForm] = useState({ rating: 5, title: "", comment: "" });
    const [submitting, setSubmitting] = useState(false);
    const [editingReview, setEditingReview] = useState(null);

    useEffect(() => {
        const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
        setInWishlist(wishlist.some(item => item._id === id));
    }, [id]);

    const toggleWishlist = () => {
        const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
        if (inWishlist) {
            const updated = wishlist.filter(item => item._id !== id);
            localStorage.setItem("wishlist", JSON.stringify(updated));
            setInWishlist(false);
        } else {
            wishlist.push({
                _id: product._id,
                name: product.name,
                price: product.price,
                originalPrice: product.originalPrice,
                images: product.images,
                brand: product.brand?.name || "",
            });
            localStorage.setItem("wishlist", JSON.stringify(wishlist));
            setInWishlist(true);
        }
        window.dispatchEvent(new Event("wishlist-updated"));
    };

    useEffect(() => {
        productAPI.getById(id)
            .then((res) => {
                setProduct(res.data?.data?.product ?? null);
                setSelectedImage(0);
            })
            .catch(() => {})
            .finally(() => setLoaded(true));
    }, [id]);

    useEffect(() => {
        reviewAPI.getAll({ product: id })
            .then((res) => setReviews(res.data?.data?.reviews || []))
            .catch(() => setReviews([]))
            .finally(() => setReviewsLoaded(true));
    }, [id]);

    const images = product?.images?.length > 0 ? product.images : [];

    const imgRef = useRef(images.length);
    const containerRef = useRef(null);

    const goTo = useCallback((idx) => {
        if (idx < 0) idx = imgRef.current - 1;
        if (idx >= imgRef.current) idx = 0;
        setSelectedImage(idx);
    }, []);

    useEffect(() => { imgRef.current = images.length; }, [images.length]);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "ArrowLeft") goTo(selectedImage - 1);
            if (e.key === "ArrowRight") goTo(selectedImage + 1);
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [selectedImage, goTo]);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        let startX = 0;
        const onStart = (e) => { startX = e.touches[0].clientX; };
        const onEnd = (e) => {
            const diff = startX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? goTo(selectedImage + 1) : goTo(selectedImage - 1);
            }
        };
        el.addEventListener("touchstart", onStart, { passive: true });
        el.addEventListener("touchend", onEnd, { passive: true });
        return () => { el.removeEventListener("touchstart", onStart); 
            el.removeEventListener("touchend", onEnd); };
    }, [selectedImage, goTo]);

    const userInfo = (() => {
        try { return JSON.parse(sessionStorage.getItem("userInfo")); } catch { return null; }
    })();
    const token = sessionStorage.getItem("token");

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!token) { alert("Vui lòng đăng nhập để đánh giá"); return; }
        setSubmitting(true);
        try {
            if (editingReview) {
                const { data } = await reviewAPI.update(editingReview, {
                    rating: reviewForm.rating,
                    title: reviewForm.title,
                    comment: reviewForm.comment,
                });
                setReviews((prev) => prev.map((r) => r._id === editingReview ? { ...r, ...data.data } : r));
            } else {
                const { data } = await reviewAPI.create({
                    rating: reviewForm.rating,
                    productId: id,
                    title: reviewForm.title,
                    comment: reviewForm.comment,
                });
                setReviews((prev) => [data.data, ...prev]);
            }
            setReviewForm({ rating: 5, title: "", comment: "" });
            setEditingReview(null);
        } catch (err) {
            alert(err.response?.data?.message || "Có lỗi xảy ra");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) return;
        try {
            await reviewAPI.delete(reviewId);
            setReviews((prev) => prev.filter((r) => r._id !== reviewId));
        } catch (err) {
            alert(err.response?.data?.message || "Có lỗi xảy ra");
        }
    };

    const startEditReview = (review) => {
        setEditingReview(review._id);
        setReviewForm({ rating: review.rating, title: review.title || "", comment: review.comment });
        window.scrollTo({ top: document.getElementById("review-form")?.offsetTop - 100, behavior: "smooth" });
    };

    if (!loaded) {
        return <Skeleton.ProductDetail />;
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <div className="size-20 rounded-2xl bg-gray-50 flex items-center justify-center mb-5">
                    <FontAwesomeIcon icon={faImage} className="text-4xl text-gray-300" />
                </div>
                <p className="text-gray-600 text-lg font-medium mb-2">Sản phẩm không tồn tại</p>
                <p className="text-gray-400 text-sm mb-6">Có thể sản phẩm đã bị xoá hoặc đường dẫn không đúng</p>
                <Link to="/products" className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-white rounded-full font-medium transition shadow-sm">
                    Quay lại cửa hàng
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
            <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Sản phẩm", href: "/products" }, { label: product.name }]} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
                <div ref={containerRef}>
                    <div className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 mb-3 sm:mb-4 shadow-soft group">
                        {images.length > 0 ? (
                            <>
                                <div
                                    className="flex transition-transform duration-500 ease-out absolute inset-0"
                                    style={{ transform: `translateX(-${selectedImage * 100}%)` }}
                                >
                                    {images.map((img, idx) => (
                                        <div key={idx} className="min-w-full h-full shrink-0">
                                            <img
                                                src={getOptimizedImage(img, 600)}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                                loading={idx === 0 ? "eager" : "lazy"}
                                                decoding="async"
                                                fetchPriority={idx === 0 ? "high" : "low"}
                                            />
                                        </div>
                                    ))}
                                </div>
                                {images.length > 1 && (
                                    <>
                                        <button type="button" onClick={() => goTo(selectedImage - 1)}
                                            className="absolute left-2 top-1/2 -translate-y-1/2 size-9 rounded-full bg-white/80 hover:bg-white shadow-md flex items-center justify-center text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <FontAwesomeIcon icon={faChevronLeft} className="text-sm" />
                                        </button>
                                        <button type="button" onClick={() => goTo(selectedImage + 1)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 size-9 rounded-full bg-white/80 hover:bg-white shadow-md flex items-center justify-center text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
                                        </button>
                                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                            {images.map((_, idx) => (
                                                <button key={idx} type="button" onClick={() => setSelectedImage(idx)}
                                                    className={`size-2 rounded-full transition-all ${idx === selectedImage ? "bg-white w-4" : "bg-white/50 hover:bg-white/70"}`} />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <FontAwesomeIcon icon={faImage} className="text-4xl sm:text-6xl" />
                            </div>
                        )}
                    </div>
                    {images.length > 1 && (
                        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setSelectedImage(idx)}
                                    className={`size-14 sm:size-20 rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all duration-200 shrink-0 ${
                                        selectedImage === idx
                                            ? "border-amber-400 shadow-sm ring-1 ring-amber-400/30"
                                            : "border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100"
                                    }`}
                                >
                                    <img src={getOptimizedImage(img, 150)} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}

                    {product.brand?.name && (
                        <div className="mt-4 rounded-xl sm:rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 shadow-soft">
                            <div className="flex items-center gap-4">
                                <div className="size-16 sm:size-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                                    {product.brand.logo ? (
                                        <img src={product.brand.logo} alt={product.brand.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-200">
                                            <FontAwesomeIcon icon={faTrademark} className="text-xl sm:text-2xl" />
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[11px] font-semibold tracking-wider uppercase text-amber-500">Thương hiệu</p>
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{product.brand.name}</h3>
                                    {product.brand.country && (
                                        <span className="inline-flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[10px] text-gray-400" />
                                            {product.brand.country}
                                        </span>
                                    )}
                                </div>
                            </div>
                            {product.brand.description && (
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                    <h4 className="text-xs font-semibold text-gray-800 uppercase tracking-wider mb-1">Giới thiệu thương hiệu</h4>
                                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed whitespace-pre-line">{product.brand.description}</p>
                                </div>
                            )}
                            {product.brand.website && (
                                <a
                                    href={product.brand.website.startsWith("http") ? product.brand.website : `https://${product.brand.website}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-3 inline-flex items-center gap-1.5 text-xs sm:text-sm text-amber-500 hover:text-amber-600 font-medium"
                                >
                                    <FontAwesomeIcon icon={faGlobe} />
                                    {product.brand.website}
                                </a>
                            )}
                        </div>
                    )}
                </div>

                <div className="space-y-4 sm:space-y-6">
                    <div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1 sm:mb-2">
                            {product.category?.name && (
                                <p className="text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-amber-500">
                                    {product.category.name}
                                </p>
                            )}
                            {product.brand?.name && (
                                <p className="text-[11px] sm:text-xs font-medium text-gray-400 flex items-center gap-1">
                                    <FontAwesomeIcon icon={faTrademark} className="text-[10px]" />
                                    {product.brand.name}
                                </p>
                            )}
                        </div>
                        <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-gray-900 leading-tight">{product.name}</h1>
                    </div>

                    <div className="flex items-center justify-between sm:block">
                        <div>
                            <div className="flex items-baseline gap-2 flex-wrap">
                                {product.originalPrice > product.price && (
                                    <span className="text-base sm:text-lg text-gray-400 line-through">{formatCurrency(product.originalPrice * quantity)}</span>
                                )}
                                <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-600">{formatCurrency(product.price * quantity)}</span>
                            </div>
                            {quantity > 1 && (
                                <span className="text-xs sm:text-sm text-amber-400 ml-2">
                                    ({formatCurrency(product.price)} × {quantity})
                                </span>
                            )}
                        </div>
                        <div className="sm:mt-2">
                            {product.stock > 0 ? (
                                <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 rounded-full px-3 py-1">
                                    <span className="size-1.5 rounded-full bg-emerald-500" />
                                    Còn hàng
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-full px-3 py-1">
                                    <FontAwesomeIcon icon={faXmark} className="text-xs" />
                                    Hết hàng
                                </span>
                            )}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-800 mb-1 sm:mb-2 text-sm sm:text-base">Mô tả sản phẩm</h3>
                        <div className="w-10 h-0.5 bg-amber-400 rounded-full mb-2 sm:mb-3" />
                        <p className="text-sm sm:text-base text-gray-500 leading-relaxed">{nl2br(product.description)}</p>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex items-center border border-gray-200 rounded-xl shrink-0">
                            <button
                                type="button"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="p-2 sm:p-3 hover:bg-amber-50 hover:text-amber-500 transition text-gray-600"
                            >
                                <FontAwesomeIcon icon={faMinus} className="text-xs sm:text-sm" />
                            </button>
                            <span className="px-3 sm:px-5 font-medium text-gray-800 min-w-[2.5rem] sm:min-w-[3rem] text-center text-sm">{quantity}</span>
                            <button
                                type="button"
                                onClick={() => setQuantity(Math.min(product.stock || 1, quantity + 1))}
                                className="p-2 sm:p-3 hover:bg-amber-50 hover:text-amber-500 transition text-gray-600"
                            >
                                <FontAwesomeIcon icon={faPlus} className="text-xs sm:text-sm" />
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={() => addToCart(product, quantity)}
                            disabled={product.stock === 0}
                            className={`flex-1 min-w-0 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-medium transition flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm ${
                                product.stock === 0
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : addedMap[product._id]
                                        ? "bg-emerald-500 text-white"
                                        : "bg-amber-400 hover:bg-amber-500 text-white"
                            }`}
                        >
                            <FontAwesomeIcon icon={addedMap[product._id] ? faCheck : faShoppingCart} className="text-sm" />
                            <span className="sm:hidden">Thêm giỏ</span>
                            <span className="hidden sm:inline">{product.stock === 0 ? "Hết hàng" : addedMap[product._id] ? "Đã thêm vào giỏ" : "Thêm vào giỏ"}</span>
                        </button>
                        <button
                            type="button"
                            onClick={toggleWishlist}
                            className={`p-2.5 sm:p-3.5 border rounded-xl transition shrink-0 flex items-center gap-1.5 ${
                                inWishlist
                                    ? "bg-red-50 border-red-200 text-red-500"
                                    : "border-gray-200 hover:bg-red-50 hover:text-red-500 text-gray-500"
                            }`}
                        >
                            <FontAwesomeIcon icon={faHeart} />
                            <span className="text-xs sm:hidden">{inWishlist ? "Đã thích" : "Thích"}</span>
                        </button>
                    </div>

                    <div className="pt-4 sm:pt-6 border-t border-gray-100 space-y-2 sm:grid sm:grid-cols-3 sm:gap-3 sm:space-y-0">
                        <div className="flex items-center gap-3 p-3 rounded-xl text-sm">
                            <div className="size-9 rounded-lg flex items-center justify-center shrink-0">
                                <FontAwesomeIcon icon={faTruck} />
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">Miễn phí giao hàng</p>
                                <p className="text-gray-400 text-xs">Cho đơn trên 500k</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl text-sm">
                            <div className="size-9 rounded-lgflex items-center justify-center shrink-0">
                                <FontAwesomeIcon icon={faShieldAlt}  />
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">Bảo hành 12 tháng</p>
                                <p className="text-gray-400 text-xs">Chính hãng 100%</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl text-sm">
                            <div className="size-9 rounded-lg flex items-center justify-center shrink-0">
                                <FontAwesomeIcon icon={faUndo}  />
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">Đổi trả 7 ngày</p>
                                <p className="text-gray-400 text-xs">Hoàn tiền nhanh chóng</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-12 sm:mt-16">
                <div className="flex items-center gap-3 mb-6">
                    <FontAwesomeIcon icon={faStar} className="text-xl text-amber-400" />
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Đánh giá sản phẩm</h2>
                    {product?.numReview > 0 && (
                        <span className="text-sm text-gray-400 font-medium">({product.numReview} đánh giá)</span>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Review List */}
                    <div className="lg:col-span-2 space-y-4">
                        {!reviewsLoaded ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="size-10 rounded-full bg-gray-200" />
                                            <div className="h-4 w-24 bg-gray-200 rounded" />
                                        </div>
                                        <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
                                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                                    </div>
                                ))}
                            </div>
                        ) : reviews.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                                <FontAwesomeIcon icon={faStar} className="text-4xl text-gray-200 mb-3" />
                                <p className="text-gray-500">Chưa có đánh giá nào cho sản phẩm này</p>
                                <p className="text-sm text-gray-400 mt-1">Hãy là người đầu tiên đánh giá!</p>
                            </div>
                        ) : (
                            reviews.map((review) => (
                                <div key={review._id} className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 shadow-soft">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            {review.user?.avatar ? (
                                                <img src={review.user.avatar} alt="" className="size-10 rounded-full object-cover" />
                                            ) : (
                                                <div className="size-10 rounded-full bg-amber-100 flex items-center justify-center">
                                                    <FontAwesomeIcon icon={faUser} className="text-amber-500 text-sm" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-semibold text-gray-800 text-sm">{review.user?.name || "Người dùng"}</p>
                                                <StarRating value={review.rating} readonly size="xs" />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-400">{formatDateTime(review.createdAt)}</span>
                                            {userInfo && (userInfo._id === review.user?._id || userInfo.role === "admin") && (
                                                <div className="flex gap-1">
                                                    {userInfo._id === review.user?._id && (
                                                        <button type="button" onClick={() => startEditReview(review)}
                                                            className="size-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-amber-500 transition"
                                                            title="Sửa đánh giá">
                                                            <FontAwesomeIcon icon={faPenToSquare} className="text-xs" />
                                                        </button>
                                                    )}
                                                    <button type="button" onClick={() => handleDeleteReview(review._id)}
                                                        className="size-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition"
                                                        title="Xóa đánh giá">
                                                        <FontAwesomeIcon icon={faTrash} className="text-xs" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {review.title && (
                                        <h4 className="font-medium text-gray-800 text-sm mb-1">{review.title}</h4>
                                    )}
                                    <p className="text-sm text-gray-500 leading-relaxed">{review.comment}</p>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Review Form */}
                    <div id="review-form" className="lg:col-span-1">
                        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-soft sticky top-24">
                            <h3 className="font-semibold text-gray-800 mb-4">
                                {editingReview ? "Chỉnh sửa đánh giá" : "Viết đánh giá"}
                            </h3>
                            {token ? (
                                <form onSubmit={handleReviewSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Đánh giá của bạn</label>
                                        <StarRating
                                            value={reviewForm.rating}
                                            onChange={(v) => setReviewForm((p) => ({ ...p, rating: v }))}
                                            size="lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề (tùy chọn)</label>
                                        <input
                                            type="text"
                                            value={reviewForm.title}
                                            onChange={(e) => setReviewForm((p) => ({ ...p, title: e.target.value }))}
                                            placeholder="Tóm tắt đánh giá của bạn"
                                            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
                                        <textarea
                                            value={reviewForm.comment}
                                            onChange={(e) => setReviewForm((p) => ({ ...p, comment: e.target.value }))}
                                            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                                            rows={4}
                                            required
                                            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 transition resize-y"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        {editingReview && (
                                            <button type="button" onClick={() => { setEditingReview(null); setReviewForm({ rating: 5, title: "", comment: "" }); }}
                                                className="flex-1 px-4 py-2.5 text-sm font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition">
                                                Hủy
                                            </button>
                                        )}
                                        <button
                                            type="submit"
                                            disabled={submitting || !reviewForm.comment.trim()}
                                            className="flex-1 px-4 py-2.5 text-sm font-medium rounded-lg bg-amber-400 hover:bg-amber-500 text-white transition disabled:opacity-50"
                                        >
                                            {submitting ? "Đang gửi..." : editingReview ? "Cập nhật" : "Gửi đánh giá"}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="text-center py-6">
                                    <p className="text-sm text-gray-500 mb-3">Vui lòng đăng nhập để đánh giá sản phẩm</p>
                                    <Link to="/login" className="inline-block px-6 py-2.5 text-sm font-medium rounded-lg bg-amber-400 hover:bg-amber-500 text-white transition">
                                        Đăng nhập
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
