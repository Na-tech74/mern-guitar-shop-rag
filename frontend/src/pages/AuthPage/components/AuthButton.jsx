export default function AuthButton({ type = "submit", disabled = false, loading, children }) {
    return (
        <button
            type={type}
            disabled={disabled}
            className="w-full mt-2 py-3 bg-[#2c1a06] text-[#f0d49a] text-xs uppercase tracking-widest rounded-lg hover:opacity-85 transition disabled:opacity-50"
        >
            {loading ? children : children}
        </button>
    );
}