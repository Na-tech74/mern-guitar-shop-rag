import { faChartPie, faChartColumn, faFileLines, faUsers, faBox, faCartShopping, faTag, faGear, faBell } from '@fortawesome/free-solid-svg-icons';

export const menuItems = [
    {
      name: 'TRANG CHỦ',
      path: '/',
      hasDropdown: false
    },
    {
      name: 'GIỚI THIỆU',
      path: '/gioi-thieu',
      hasDropdown: false
    },
    {
      name: 'KHÓA HỌC',
      path: '/khoa-hoc',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Guitar cơ bản', path: '/khoa-hoc/guitar-co-ban' },
        { name: 'Guitar nâng cao', path: '/khoa-hoc/guitar-nang-cao' },
        { name: 'Piano cơ bản', path: '/khoa-hoc/piano-co-ban' },
        { name: 'Piano nâng cao', path: '/khoa-hoc/piano-nang-cao' },
        { name: 'Ukulele', path: '/khoa-hoc/ukulele' },
        { name: 'Nhạc lý', path: '/khoa-hoc/nhac-ly' },
      ]
    },
    {
      name: 'ĐÀN PIANO',
      path: '/dan-piano',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Piano cơ', path: '/dan-piano/co', badge: 'HOT' },
        { name: 'Piano điện', path: '/dan-piano/dien', badge: 'NEW' },
        { name: 'Piano cũ', path: '/dan-piano/cu', badge: 'SALE' },
        { name: 'Phụ kiện Piano', path: '/phu-kien/piano' },
      ]
    },
    {
      name: 'ĐÀN GUITAR',
      path: '/dan-guitar',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Guitar Acoustic', path: '/dan-guitar/acoustic', badge: 'BEST' },
        { name: 'Guitar Classic', path: '/dan-guitar/classic' },
        { name: 'Guitar Electric', path: '/dan-guitar/electric' },
        { name: 'Guitar Bass', path: '/dan-guitar/bass' },
        { name: 'Guitar Cũ', path: '/dan-guitar/cu', badge: 'SALE' },
        { name: 'Phụ kiện Guitar', path: '/phu-kien/guitar' },
      ]
    },
    {
      name: 'PHỤ KIỆN',
      path: '/phu-kien',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Dây đàn', path: '/phu-kien/day-dan' },
        { name: 'Capo', path: '/phu-kien/capo' },
        { name: 'Túi đàn', path: '/phu-kien/tui-dan' },
        { name: 'Giá đàn', path: '/phu-kien/gia-dan' },
        { name: 'Amply', path: '/phu-kien/amply' },
        { name: 'Tai nghe', path: '/phu-kien/tai-nghe' },
      ]
    },
    {
      name: 'LIÊN HỆ',
      path: '/lien-he',
      hasDropdown: false
    },
];

export const adminSidebarMenuItems = [
    {
        title: "Tổng quan",
        items: [
            {
                name: "Bảng điều khiển",
                path: "/admin",
                icon: faChartPie,
                badge: ""
            },
            {
                name: "Phân tích",
                path: "/admin/analytics",
                icon: faChartColumn
            },
            {
                name: "Báo cáo",
                path: "/admin/reports",
                icon: faFileLines,
                badge: "Mới"
            }
        ]
    },
    {
        title: "Quản lý",
        items: [
            {
                name: "Người dùng",
                path: "/admin/users",
                icon: faUsers
            },
            {
                name: "Sản phẩm",
                path: "/admin/products",
                icon: faBox
            },
            {
                name: "Đơn hàng",
                path: "/admin/orders",
                icon: faCartShopping
            },
            {
                name: "Danh mục",
                path: "/admin/categories",
                icon: faTag
            }
        ]
    },
    {
        title: "Hệ thống",
        items: [
            {
                name: "Cài đặt",
                path: "/admin/settings",
                icon: faGear
            },
            {
                name: "Thông báo",
                path: "/admin/notifications",
                icon: faBell
            }
        ]
    }
];