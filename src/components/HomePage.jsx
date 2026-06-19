import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-text font-sans">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-brand-bg/90 backdrop-blur-md border-b border-brand-wood/20 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="MoryTory Logo" className="h-10 w-10 object-contain rounded-full" />
          <div className="text-2xl font-serif font-bold text-brand-wood tracking-wide">
            MoryTory
          </div>
        </div>
        <div className="flex items-center gap-6">
          <a href="https://www.facebook.com/profile.php?id=61590697139502" target="_blank" rel="noopener noreferrer" className="text-brand-wood hover:opacity-80 transition-opacity">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
            </svg>
          </a>
          <div className="relative cursor-pointer hover:text-brand-wood transition-colors">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-brand-accent-green text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              0
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-brand-text leading-tight">
            Lưu Giữ Kỷ Niệm Của Bạn Với <span className="text-brand-wood italic">Khung Ảnh Gỗ 3D</span> Tích Hợp AR
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Chế tác khung ảnh gỗ mộc mạc, cao cấp kết hợp hiệu ứng sống động. Quét để tái hiện những khoảnh khắc tuyệt vời nhất.
          </p>
          
          <div className="pt-8">
            <button
              onClick={() => navigate('/design')}
              className="px-8 py-4 bg-brand-accent-green text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 hover:bg-[#7a9352] transition-all duration-300 ease-in-out inline-flex items-center gap-2"
            >
              Bắt Đầu Thiết Kế Khung Ảnh
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
