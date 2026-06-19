import { useDesign } from '../store/DesignContext';

export default function Step5Summary({ onOrder, buttonText = "Đặt hàng ngay", disabled = false }) {
  const { pricing, selectedAREffect } = useDesign();

  return (
    <div className="fixed bottom-0 left-0 md:left-1/2 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] z-30">
      <div className="max-w-xl mx-auto flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500 mb-1">
            Khung gỗ ({pricing.base.toLocaleString()}đ) {selectedAREffect && '+ Hiệu ứng AR (5.000đ)'}
          </div>
          <div className="text-2xl font-bold text-brand-text">
            {pricing.total.toLocaleString()}đ
          </div>
        </div>
        
        <button 
          onClick={onOrder}
          disabled={disabled}
          className={`px-10 py-3 font-semibold rounded shadow transition-all ${
            disabled 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
              : 'bg-brand-wood text-white hover:bg-opacity-90 hover:shadow-md'
          }`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
