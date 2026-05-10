import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch, faHeart, faUser, faCartShopping, faBars,
  faChevronDown, faEnvelope, faTimes, faRightFromBracket, faPhone,
} from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faYoutube, faTiktok, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { menuItems } from '../../data/dbContext';

export default function Header() {
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount] = useState(3);
  const [wishlistCount] = useState(2);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsAccountOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tim-kiem?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const isLoggedIn = !!userInfo;

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    setIsAccountOpen(false);
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      <header className={`w-full z-40 transition-all duration-500 ease-in-out ${isSticky
        ? 'fixed top-0 left-0 right-0 shadow-lg bg-white/98 backdrop-blur-md'
        : 'relative bg-white'
        }`}>

        {/* Top Bar */}
        <div className="hidden lg:block bg-gradient-to-r from-amber-600 to-amber-400 text-white text-xs py-2">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <a href="mailto:namn98561@gmail.com" className="hover:text-amber-200 transition">
                <FontAwesomeIcon icon={faEnvelope} className="mr-1" />
                namn98561@gmail.com
              </a>
              <span className="opacity-50">|</span>
              <a href="tel:0378623181" className="hover:text-amber-200 transition">
                <FontAwesomeIcon icon={faPhone} className="mr-1" />
                037.862.3181
              </a>
            </div>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-200 transition">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-200 transition">
                <FontAwesomeIcon icon={faYoutube} />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-200 transition">
                <FontAwesomeIcon icon={faTiktok} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-200 transition">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="py-3 px-4 bg-white">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="shrink-0">
              <img src="/logo.jpg" alt="Nam Acoustic" className="h-10 md:h-12" />
            </Link>

            {/* Search - Desktop */}
            <div className="hidden md:flex flex-1 max-w-lg">
              <form onSubmit={handleSearch} className="flex w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm..."
                  className="flex-1 px-4 py-2.5 outline-none text-sm rounded-l-lg border border-gray-200 bg-gray-50 focus:border-amber-500 transition"
                />
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-500 px-5 text-white rounded-r-lg"
                >
                  <FontAwesomeIcon icon={faSearch} className="text-white" />
                </button>
              </form>
            </div>

            {/* Right Icons */}
            <div className="hidden md:flex items-center gap-5">
              <Link to="/wishlist" className="relative group">
                <FontAwesomeIcon icon={faHeart} className="text-xl text-gray-600 group-hover:text-amber-600 transition-all duration-200 ease-in-out" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Account Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsAccountOpen(!isAccountOpen)}
                  className="flex items-center gap-2 text-gray-600 hover:text-amber-600 transition-all duration-200 ease-in-out"
                >
                  <FontAwesomeIcon icon={faUser} className="text-xl" />
                  <span className="text-sm hidden lg:block">
                    {isLoggedIn ? userInfo?.name : 'Đăng nhập'}
                  </span>
                  <FontAwesomeIcon icon={faChevronDown} className="text-[10px]" />
                </button>

                {isAccountOpen && (
                  <div className="absolute right-0 top-full mt-3 w-56 bg-white rounded-lg shadow-lg border border-gray-100 z-[100] overflow-hidden transition-all duration-300 ease-out opacity-100 translate-y-0">
                    <div className="p-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                      <p className="font-medium">
                        {isLoggedIn ? `Xin chào, ${userInfo?.name}` : 'Chào mừng bạn!'}
                      </p>
                      {isLoggedIn && <p className="text-xs opacity-80">{userInfo?.email}</p>}
                    </div>
                    {!isLoggedIn ? (
                      <div className="py-2">
                        <Link to="/login" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-amber-50" onClick={() => setIsAccountOpen(false)}>
                          <span>Đăng nhập</span>
                        </Link>
                        <Link to="/register" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-amber-50 border-t" onClick={() => setIsAccountOpen(false)}>
                          <span>Đăng ký</span>
                        </Link>
                      </div>
                    ) : (
                      <div className="py-2">
                        <Link to="/account" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-amber-50" onClick={() => setIsAccountOpen(false)}>
                          <span>Tài khoản</span>
                        </Link>
                        <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-amber-50 border-t" onClick={() => setIsAccountOpen(false)}>
                          <span>Đơn hàng</span>
                        </Link>
                        <button onClick={handleLogout} className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 border-t">
                          <span>Đăng xuất</span>
                          <FontAwesomeIcon icon={faRightFromBracket} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Cart */}
              <Link to="/cart" className="relative group">
                <FontAwesomeIcon icon={faCartShopping} className="text-xl text-gray-600 group-hover:text-amber-600 transition-all duration-200 ease-in-out" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile Buttons */}
            <div className="flex lg:hidden items-center gap-3">
              <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-gray-700 text-xl">
                <FontAwesomeIcon icon={faSearch} className="text-amber-600" />
              </button>
              <Link to="/cart" className="relative text-gray-700">
                <FontAwesomeIcon icon={faCartShopping} className="text-xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-700 text-2xl">
                <FontAwesomeIcon icon={faBars} />
              </button>
            </div>
          </div>
        </div>

{/* Mobile Search */}
        {isSearchOpen && (
          <div className="lg:hidden px-4 pb-3 border-b border-gray-100 transition-all duration-300 ease-out">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm..."
                className="flex-1 px-4 py-2 outline-none text-sm rounded-l-lg border border-gray-200 bg-gray-50"
                autoFocus
              />
              <button type="submit" className="bg-amber-600 px-5 text-white rounded-r-lg">
                <FontAwesomeIcon icon={faSearch} className="text-white" />
              </button>
            </form>
          </div>
        )}

        {/* Navigation - Desktop */}
        <div className="hidden lg:block bg-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between">
              <ul className="flex">
                {menuItems.map((item, idx) => (
                  <li key={idx} className="relative"
                    onMouseEnter={() => item.hasDropdown && setOpenDropdown(idx)}
                    onMouseLeave={() => setOpenDropdown(null)}>
                    <Link to={item.path} className="text-gray-600 hover:text-amber-600 px-4 py-3 block text-sm font-medium transition-all duration-200 ease-in-out relative">
                      <span className="mr-1">{item.icon}</span>
                      {item.name}
                      {item.hasDropdown && <FontAwesomeIcon icon={faChevronDown} className="ml-1 text-[10px]" />}
                    </Link>
                    {item.hasDropdown && openDropdown === idx && (
                      <div className="absolute top-full left-0 w-56 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
                        <div className="py-2">
                          {item.dropdownItems.map((subItem, subIdx) => (
                            <Link key={subIdx} to={subItem.path} className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-amber-50 hover:text-amber-600">
                              <span>{subItem.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <span>Hỗ trợ:</span>
                <a href="tel:0378623181" className="text-amber-600 font-medium hover:underline">037.862.3181</a>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky spacing */}
        <div className={`hidden lg:block h-[52px] transition-all duration-500 ease-in-out ${isSticky ? 'opacity-100' : 'opacity-0 h-0'}`}></div>
        <div className={`lg:hidden h-[60px] transition-all duration-500 ease-in-out ${isSticky ? 'opacity-100' : 'opacity-0 h-0'}`}></div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[1000] transition-opacity duration-300" onClick={() => setIsMobileMenuOpen(false)} />
          <div className={`fixed top-0 left-0 w-72 h-full bg-white z-[1001] shadow-xl overflow-y-auto transition-all duration-300 ease-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="bg-amber-600 p-4 flex justify-between items-center">
              <h2 className="text-white font-bold">Nam Acoustic</h2>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-white text-xl">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="p-4 border-b">
              {!isLoggedIn ? (
                <div className="flex gap-2">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 text-center py-2 bg-amber-600 text-white rounded text-sm">Đăng nhập</Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 text-center py-2 border border-amber-600 text-amber-600 rounded text-sm">Đăng ký</Link>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold">
                    {userInfo?.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{userInfo?.name}</p>
                    <p className="text-xs text-gray-500">{userInfo?.email}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="py-2">
              {menuItems.map((item, idx) => (
                <div key={idx}>
                  <button onClick={() => setOpenDropdown(openDropdown === idx ? null : idx)} className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:bg-gray-50">
                    <span>{item.name}</span>
                    {item.hasDropdown && <FontAwesomeIcon icon={faChevronDown} className={`text-xs ${openDropdown === idx ? 'rotate-180' : ''}`} />}
                  </button>
                  {item.hasDropdown && openDropdown === idx && (
                    <div className="bg-gray-50 pl-4">
                      {item.dropdownItems.map((subItem, subIdx) => (
                        <Link key={subIdx} to={subItem.path} className="block px-4 py-2 text-sm text-gray-600" onClick={() => setIsMobileMenuOpen(false)}>
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}