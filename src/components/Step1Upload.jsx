import { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { useDesign, useDesignDispatch } from '../store/DesignContext';
import { validateImage, revokePreviewUrl } from '../utils/fileUtils';

export default function Step1Upload() {
  const { isPrintingPhoto, photoPreviewUrl } = useDesign();
  const dispatch = useDesignDispatch();
  const [error, setError] = useState('');

  const handleToggle = (checked) => {
    dispatch({ type: 'SET_PRINTING_PHOTO', payload: checked });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImage(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setError('');
    
    // Cleanup previous URL if any
    if (photoPreviewUrl) {
      revokePreviewUrl(photoPreviewUrl);
    }

    const url = URL.createObjectURL(file);
    dispatch({ type: 'SET_PHOTO', payload: { file, url } });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-brand-text">1. Tải ảnh lên</h3>
      <p className="text-sm text-gray-500">Bức ảnh này sẽ được dùng để quét AR (Không bắt buộc - Hệ thống sẽ dùng ảnh mặc định nếu bỏ qua).</p>

      {/* Upload Box */}
      <div className="space-y-2">
        <div className="border-2 border-dashed border-brand-wood/30 rounded-xl p-8 text-center hover:bg-brand-wood/5 transition-colors cursor-pointer relative group bg-white">
          <input 
            type="file" 
            accept="image/jpeg, image/png, image/webp" 
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none">
            <div className="p-3 bg-[#FAF7F2] rounded-full shadow-sm text-brand-wood group-hover:scale-110 transition-transform">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div className="text-sm">
              <span className="font-semibold text-brand-wood">Nhấp để tải ảnh lên</span> hoặc kéo thả vào đây
            </div>
            <div className="text-xs text-gray-400">Định dạng JPG, PNG, WebP tối đa 10MB</div>
          </div>
        </div>
        {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
      </div>
      
      {/* Checkbox Toggle */}
      <label className="flex items-center space-x-3 cursor-pointer p-4 border border-brand-wood/20 rounded-xl bg-[#FAF7F2] hover:bg-brand-wood/5 transition-colors mt-4">
        <input 
          type="checkbox"
          checked={isPrintingPhoto}
          onChange={(e) => handleToggle(e.target.checked)}
          className="w-5 h-5 accent-brand-accent-green cursor-pointer"
        />
        <span className="text-brand-text font-medium select-none">
          MoryTory hỗ trợ in ảnh này dán sẵn lên khung giúp bạn (+0đ)
        </span>
      </label>
    </div>
  );
}
