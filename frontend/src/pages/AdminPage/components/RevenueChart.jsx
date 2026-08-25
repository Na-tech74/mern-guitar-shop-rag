import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartBar, faCalendarDay, faCalendarWeek } from "@fortawesome/free-solid-svg-icons";
import { orderAPI } from "../../../api";
import { formatCurrency } from "../../../helpers/formatters";

export default function RevenueChart() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState(7);

    useEffect(() => {
        setLoading(true);
        orderAPI.getRevenueChart(days)
            .then(res => setData(res.data?.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [days]);

    if (loading) {
        return (
            <div className="rounded-xl bg-white p-4 sm:p-6 shadow-sm">
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full size-8 border-b-2 border-amber-500"></div>
                </div>
            </div>
        );
    }

    if (!data || !data.chartData) return null;

    const { chartData, totalRevenue, totalOrders, maxRevenue } = data;

    return (
        <div className="rounded-xl bg-white p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faChartBar} className="text-amber-500" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">Biểu đồ doanh thu</h3>
                </div>
                <div className="flex gap-1">
                    <button
                        onClick={() => setDays(7)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            days === 7
                                ? "bg-amber-500 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        <FontAwesomeIcon icon={faCalendarWeek} className="mr-1" />
                        7 ngày
                    </button>
                    <button
                        onClick={() => setDays(30)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            days === 30
                                ? "bg-amber-500 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        <FontAwesomeIcon icon={faCalendarDay} className="mr-1" />
                        30 ngày
                    </button>
                </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-lg bg-green-50 p-3">
                    <p className="text-xs text-gray-500">Tổng doanh thu</p>
                    <p className="text-lg font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
                </div>
                <div className="rounded-lg bg-blue-50 p-3">
                    <p className="text-xs text-gray-500">Đơn đã giao</p>
                    <p className="text-lg font-bold text-blue-600">{totalOrders} đơn</p>
                </div>
            </div>

            {/* Chart */}
            <div className="relative h-48 sm:h-56">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] text-gray-400 pr-2">
                    <span>{formatCurrency(maxRevenue).replace('₫', '')}</span>
                    <span>{formatCurrency(maxRevenue / 2).replace('₫', '')}</span>
                    <span>0</span>
                </div>

                {/* Bars */}
                <div className="ml-10 sm:ml-12 h-full flex items-end gap-1 sm:gap-2">
                    {chartData.map((item, index) => {
                        const heightPercent = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
                        return (
                            <div key={index} className="flex-1 flex flex-col items-center gap-1">
                                {/* Tooltip */}
                                <div className="text-[9px] sm:text-[10px] text-gray-600 font-medium whitespace-nowrap">
                                    {item.revenue > 0 ? formatCurrency(item.revenue) : ''}
                                </div>
                                {/* Bar */}
                                <div
                                    className="w-full bg-gradient-to-t from-amber-500 to-amber-400 rounded-t-md transition-all duration-300 hover:from-amber-600 hover:to-amber-500 min-h-[2px]"
                                    style={{ height: `${Math.max(heightPercent, 2)}%` }}
                                    title={`${item.label}: ${formatCurrency(item.revenue)} (${item.orderCount} đơn)`}
                                />
                                {/* Label */}
                                <span className="text-[9px] sm:text-[10px] text-gray-500 -rotate-45 origin-left">
                                    {item.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
