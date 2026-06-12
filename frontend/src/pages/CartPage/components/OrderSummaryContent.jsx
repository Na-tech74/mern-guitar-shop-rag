import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruck } from "@fortawesome/free-solid-svg-icons";
import { getOptimizedImage } from "../../../helpers/image";
import { formatCurrency } from "../../../helpers/formatters";

export default function OrderSummaryContent({ cartItems, subtotal, itemCount, total }) {
    return (
        <>
            <div className="max-h-64 overflow-y-auto space-y-3">
                {cartItems.map((item) => (
                    <div key={item._id} className="flex gap-3 p-2 rounded-xl hover:bg-gray-50 transition">
                        <div className="size-12 sm:size-14 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                            <img
                                src={getOptimizedImage(item.images?.[0], 100) || ""}
                                alt={item.name}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                            <p className="text-xs text-gray-400">x{item.quantity}</p>
                            <p className="text-sm font-semibold text-amber-600">
                                {formatCurrency(item.price * item.quantity)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="border-t border-gray-100 mt-4 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                    <span>Tạm tính ({itemCount} sản phẩm)</span>
                    <span className="font-medium text-gray-700">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                    <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faTruck} className=" text-xs" />
                        Phí vận chuyển
                    </span>
                    <span className="text-emerald-600 font-medium">Miễn phí</span>
                </div>
                <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-base sm:text-lg">
                    <span className="text-gray-800">Tổng cộng</span>
                    <span className="text-amber-600">{formatCurrency(total)}</span>
                </div>
            </div>
        </>
    );
}
