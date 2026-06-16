import useTermsData from "./hooks/useTermsData";

export default function TermsPage() {
    const { content, loading } = useTermsData();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full size-10 border-b-2 border-amber-400" />
            </div>
        );
    }

    const header = content?.header || {};
    const sections = content?.sections || [];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
                <div className="text-center mb-10 sm:mb-14">
                    <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">{header.title || "Điều khoản và Bảo mật"}</h1>
                    {header.lastUpdated && (
                        <p className="mt-2 text-sm text-gray-500">Cập nhật lần cuối: {header.lastUpdated}</p>
                    )}
                    <div className="w-16 h-1 bg-amber-400 rounded-full mx-auto mt-4" />
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10">
                    {sections.length === 0 ? (
                        <p className="text-center text-gray-400 py-10">Nội dung đang được cập nhật...</p>
                    ) : (
                        <div className="space-y-8">
                            {sections.map((section, i) => (
                                <div key={i}>
                                    {section.title && (
                                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3">
                                            {section.title}
                                        </h2>
                                    )}
                                    {section.content && (
                                        <div className="text-gray-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                                            {section.content}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
