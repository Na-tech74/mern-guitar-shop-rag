import logo from "../assets/images/logo.jpg"
export default function Logo({ title }) {
    return (
        <div className="text-center p-2">
            {title && <h2 className="text-lg font-semibold text-gray-700 mb-2">{title}</h2>}
            <img src={logo} alt="Nam Acoustic" className="w-30 h-20 mx-auto object-contain" />
        </div>
    );
}