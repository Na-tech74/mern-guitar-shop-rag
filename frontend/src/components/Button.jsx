const baseStyles = "font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2";

const variants = {
    primary: "bg-amber-400 text-white hover:bg-amber-500 disabled:opacity-50 shadow-sm",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50",
    outline: "border border-amber-400 text-amber-500 hover:bg-amber-400 hover:text-white disabled:opacity-50",
    danger: "bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 shadow-sm",
    success: "bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 shadow-sm",
    ghost: "text-gray-600 hover:bg-gray-100 disabled:opacity-50",
};

const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg",
};

export default function Button({
    type = "button",
    onClick,
    disabled = false,
    loading = false,
    variant = "primary",
    size = "md",
    className = "",
    children,
    ...props
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`
                ${baseStyles}
                ${variants[variant]}
                ${sizes[size]}
                ${className}
            `}
            {...props}
        >
            {loading && (
                <svg className="animate-spin size-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            )}
            {children}
        </button>
    );
}