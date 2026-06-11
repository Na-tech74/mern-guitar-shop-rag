import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBagShopping, faBoxOpen } from "@fortawesome/free-solid-svg-icons";

export default function EmptyState({ hasOrders }) {
    return (
        <div className="bg-white rounded-xl shadow-soft border border-gray-100 py-16 px-6 text-center">
            <div className="size-20 rounded-full  mx-auto flex items-center justify-center mb-4">
                <FontAwesomeIcon icon={faBoxOpen} className="text-3xl text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {hasOrders ? "Không có đơn hàng nào" : "Chưa có đơn hàng"}
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                {hasOrders
                    ? "Thử chọn bộ lọc khác để xem đơn hàng."
                    : "Khám phá các sản phẩm tuyệt vời và đặt đơn đầu tiên của bạn."}
            </p>
            <Link
                to="/products"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-white text-sm font-semibold transition shadow-soft"
            >
                <FontAwesomeIcon icon={faBagShopping} className="text-xs" />
                Mua sắm ngay
            </Link>
        </div>
    );
}
