export default function Input({
    type = "text",
    name,
    value,
    onChange,
    placeholder,
    disabled = false,
    label,
    error,
    className = "",
    required = false,
    ...props
}) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                className={`
                    w-full px-4 py-2.5 text-sm
                    border rounded-lg
                    outline-none transition-colors duration-200
                    ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
                    ${error
                        ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        : "border-gray-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    }
                    ${className}
                `}
                {...props}
            />
            {error && (
                <p className="mt-1 text-xs text-red-500">{error}</p>
            )}
        </div>
    );
}