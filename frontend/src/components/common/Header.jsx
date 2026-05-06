import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVerticalMenuOpen, setIsVerticalMenuOpen] = useState(false);

  // Sticky header on scroll
  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Menu data
  const mainMenuItems = [
    { name: 'GIỚI THIỆU', path: '/gioi-thieu' },
    { name: 'Khoá Học', path: '/khoa-hoc' },
    { name: 'Đàn Piano', path: '/dan-piano' },
    { name: 'Đàn Guitar', path: '/dan-guitar' },
    { name: 'Phụ Kiện', path: '/phu-kien' },
    { name: 'DỊCH VỤ', path: '/dich-vu' },
  ];

  const verticalMenuItems = [
    { name: 'Đàn Guitar', path: '/dan-guitar' },
    { name: 'Đàn Organ', path: '/dan-organ' },
    { name: 'Đàn Piano', path: '/dan-piano' },
    { name: 'Đàn Ukulele', path: '/dan-ukulele' },
    { name: 'Phụ Kiện', path: '/phu-kien' },
  ];

  return (
    <>
      <header className={`w-full z-50 bg-black ${isSticky ? 'fixed top-0 shadow-lg animate-slideDown' : 'relative'}`}>

        {/* Top Bar - Ẩn trên mobile */}
        <div className="hidden md:block bg-black text-white text-xs py-2 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 flex justify-between">
            <span>🎸 Shop Guitar Cầu Giấy Hà Nội - Uy Tín Hàng Đầu</span>
            <div className="flex gap-5">
              <a href="tel:0825489999" className="hover:text-yellow-500">📞 0825.48.9999</a>
              <a href="mailto:Manyluxmusic@gmail.com" className="hover:text-yellow-500">✉️ Manyluxmusic@gmail.com</a>
            </div>
          </div>
        </div>

        {/* Header Main */}
        <div className="py-3 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">

            {/* Logo */}
            <Link to="/" className="shrink-0">
              <img src="/logo.jpg" alt="Logo" className="h-12 w-auto" />
            </Link>

            {/* Desktop: Search + Icons */}
            <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
              <form className="flex bg-white rounded-full overflow-hidden w-[450px]" onSubmit={(e) => e.preventDefault()}>
                <select className="px-4 py-2 bg-gray-100 text-sm border-none outline-none">
                  <option>All</option>
                  <option>Đàn Guitar</option>
                  <option>Phụ Kiện</option>
                </select>
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="flex-1 px-4 py-2 outline-none text-sm"
                />
                <button type="submit" className="bg-amber-700 hover:bg-amber-600 px-5 text-white">
                  🔍
                </button>
              </form>

              <div className="flex gap-6">
                <Link to="/wishlist" className="text-white hover:text-yellow-500 text-sm">❤️ Yêu thích</Link>
                <Link to="/register" className="text-white hover:text-yellow-500 text-sm">👤 Tài khoản</Link>
                <Link to="/cart" className="text-white hover:text-yellow-500 text-sm relative">
                  🛒 Giỏ hàng
                  <span className="absolute -top-2 -right-4 bg-yellow-500 text-black text-[10px] px-1.5 py-0.5 rounded-full">0</span>
                </Link>
              </div>
            </div>

            {/* Mobile: Menu Toggle + Icons */}
            <div className="flex md:hidden items-center gap-4">
              <button onClick={() => setIsMobileMenuOpen(true)} className="text-white text-2xl">
                ☰
              </button>
              <Link to="/cart" className="text-white text-xl relative">
                🛒
                <span className="absolute -top-2 -right-3 bg-yellow-500 text-black text-[10px] px-1.5 py-0.5 rounded-full">0</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Navigation - Desktop */}
        <div className="hidden md:block bg-gray-700 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-5">

            {/* Vertical Menu */}
            <div
              className="relative"
              onMouseEnter={() => setIsVerticalMenuOpen(true)}
              onMouseLeave={() => setIsVerticalMenuOpen(false)}
            >
              <div className="bg-amber-700 text-white px-5 py-2.5 rounded-md cursor-pointer flex items-center gap-2 font-bold text-sm">
                ☰ <span>Danh Mục</span> ▼
              </div>
              {isVerticalMenuOpen && (
                <ul className="absolute top-full left-0 w-60 bg-white shadow-lg z-50">
                  {verticalMenuItems.map((item, idx) => (
                    <li key={idx}>
                      <Link to={item.path} className="block px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-amber-700 border-b">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Main Menu */}
            <nav className="flex-1">
              <ul className="flex gap-1">
                {mainMenuItems.map((item, idx) => (
                  <li key={idx}>
                    <Link to={item.path} className="text-white hover:text-yellow-500 px-4 py-2.5 block font-bold text-sm">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Contact Info */}
            <div className="flex gap-4 text-white text-xs">
              <a href="mailto:Manyluxmusic@gmail.com" className="hover:text-yellow-500">✉️ Contact</a>
              <span>🕐 08:00 - 22:00</span>
              <a href="tel:0825489999" className="hover:text-yellow-500">📞 0825.48.9999</a>
            </div>
          </div>
        </div>

        {/* Sticky spacing - tránh nội dung bị che khi header fixed */}
        {isSticky && <div className="h-[72px] md:h-[110px]"></div>}
      </header>

      {/* Mobile Menu Sidebar */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[1000]"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="fixed top-0 left-0 w-72 h-full bg-white z-[1001] shadow-xl overflow-y-auto animate-slideInLeft">
            <div className="flex justify-between items-center p-4 border-b">
              <span className="font-bold">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-2xl">✕</button>
            </div>

            <div className="p-4 border-b">
              <input type="text" placeholder="Tìm kiếm..." className="w-full p-2 border rounded-md" />
            </div>

            <ul className="py-2">
              {[...mainMenuItems, ...verticalMenuItems].map((item, idx) => (
                <li key={idx} className="border-b">
                  <Link
                    to={item.path}
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="p-4 border-t mt-4">
              <a href="tel:0825489999" className="block py-2 text-gray-700">📞 0825.48.9999</a>
              <a href="mailto:Manyluxmusic@gmail.com" className="block py-2 text-gray-700">✉️ Manyluxmusic@gmail.com</a>
            </div>
          </div>
        </>
      )}
    </>
  );
};