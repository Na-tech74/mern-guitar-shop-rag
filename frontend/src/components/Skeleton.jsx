export default function Skeleton({ count, className, children }) {
    return (
        <div className={className}>
            {Array.from({ length: count }, (_, i) => (
                <div key={i}>{children}</div>
            ))}
        </div>
    );
}

Skeleton.Block = function Block({ className }) {
    return <div className={`bg-gray-200 rounded ${className}`} />;
};

Skeleton.ProductCard = function ProductCard({ count = 8, className = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" }) {
    return (
        <Skeleton count={count} className={className}>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden min-h-[420px] flex flex-col">
                <Skeleton.Block className="h-60 rounded-none" />
                <div className="p-4 flex flex-col flex-1 space-y-2.5">
                    <Skeleton.Block className="h-3 w-1/3" />
                    <Skeleton.Block className="h-4 w-full" />
                    <Skeleton.Block className="h-4 w-2/3" />
                    <div className="mt-auto space-y-3">
                        <Skeleton.Block className="h-6 w-1/2" />
                        <div className="flex gap-2">
                            <Skeleton.Block className="h-9 flex-1" />
                            <Skeleton.Block className="h-9 flex-1" />
                        </div>
                    </div>
                </div>
            </div>
        </Skeleton>
    );
};

Skeleton.ProductDetail = function ProductDetail() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-2 mb-6">
                <Skeleton.Block className="h-4 w-16" />
                <Skeleton.Block className="h-4 w-4" />
                <Skeleton.Block className="h-4 w-20" />
                <Skeleton.Block className="h-4 w-4" />
                <Skeleton.Block className="h-4 w-32" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                <div className="animate-pulse">
                    <Skeleton.Block className="aspect-square rounded-xl" />
                    <div className="flex gap-3 mt-4">
                        <Skeleton.Block className="w-20 h-20 rounded-lg" />
                        <Skeleton.Block className="w-20 h-20 rounded-lg" />
                        <Skeleton.Block className="w-20 h-20 rounded-lg" />
                    </div>
                </div>
                <div className="space-y-6 animate-pulse">
                    <Skeleton.Block className="h-5 w-24" />
                    <Skeleton.Block className="h-8 w-3/4" />
                    <Skeleton.Block className="h-20 rounded-xl" />
                    <Skeleton.Block className="h-6 w-28" />
                    <div className="space-y-2">
                        <Skeleton.Block className="h-4 w-full" />
                        <Skeleton.Block className="h-4 w-full" />
                        <Skeleton.Block className="h-4 w-2/3" />
                    </div>
                    <div className="flex gap-4">
                        <Skeleton.Block className="h-12 w-32 rounded-lg" />
                        <Skeleton.Block className="h-12 flex-1 rounded-lg" />
                        <Skeleton.Block className="h-12 w-12 rounded-lg" />
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                        <Skeleton.Block className="h-5 w-full" />
                        <Skeleton.Block className="h-5 w-full" />
                        <Skeleton.Block className="h-5 w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
};

Skeleton.CategoryCard = function CategoryCard({ count = 6 }) {
    return (
        <Skeleton count={count} className="grid grid-cols-2 md:grid-cols-6 gap-5">
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <Skeleton.Block className="h-40 rounded-none" />
                <div className="p-4 space-y-2 text-center">
                    <Skeleton.Block className="h-4 w-2/3 mx-auto" />
                    <Skeleton.Block className="h-3 w-1/2 mx-auto" />
                </div>
            </div>
        </Skeleton>
    );
};
