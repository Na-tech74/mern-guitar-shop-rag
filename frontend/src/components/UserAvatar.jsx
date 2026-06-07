export default function UserAvatar({ user, size = "md", className = "" }) {
    const sizes = {
        xs: "size-7",
        sm: "size-8",
        md: "size-9",
        lg: "size-10",
        xl: "size-12",
        "2xl": "size-16",
    };
    const textSizes = {
        xs: "text-xs",
        sm: "text-sm",
        md: "text-sm",
        lg: "text-base",
        xl: "text-lg",
        "2xl": "text-2xl",
    };

    if (user?.avatar) {
        return (
            <img
                src={user.avatar}
                alt={user?.name || "avatar"}
                className={`${sizes[size]} rounded-full object-cover bg-gray-100 ${className}`}
            />
        );
    }
    return (
        <div
            className={`${sizes[size]} rounded-full bg-gradient-to-br from-amber-400 to-amber-600 ${textSizes[size]} font-semibold text-white flex items-center justify-center shrink-0 ${className}`}
        >
            {(user?.name || "A").charAt(0).toUpperCase()}
        </div>
    );
}
