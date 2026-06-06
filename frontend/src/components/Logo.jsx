import logo from "../assets/images/logo.jpg"
export default function Logo({ title }) {
    return (
        <div className="text-center p-2">
            {title && <h2 className="text-lg font-semibold text-gray-700 mb-2">{title}</h2>}
            <div className="w-52 h-16 overflow-hidden">
                <img src={logo} alt="Nam Acoustic" width="1793" height="576" className="w-full h-full object-cover object-center" />
            </div>
        </div>
    );
}