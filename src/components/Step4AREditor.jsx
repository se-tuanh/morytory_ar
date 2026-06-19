import { useDesign, useDesignDispatch } from '../store/DesignContext';

export default function Step4AREditor() {
  const { selectedAREffect, overlay } = useDesign();
  const dispatch = useDesignDispatch();

  if (selectedAREffect === null) return null;

  return (
    <div className="space-y-6 animate-in slide-in-from-top-4 fade-in duration-300">
      <h3 className="text-xl font-semibold text-brand-text">5. Tùy chỉnh thông điệp</h3>
      
      <div className="space-y-4 bg-[#FAF7F2] p-4 rounded-xl border border-brand-wood/20">
        <div>
          <label className="block text-sm font-medium text-brand-text mb-1">
            Lời chúc / Thông điệp khắc trên ảnh
          </label>
          <input 
            type="text" 
            value={overlay.text}
            onChange={(e) => dispatch({ type: 'SET_OVERLAY_TEXT', payload: e.target.value })}
            placeholder="Ví dụ: Kỷ niệm ngày cưới 2026..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-accent-green focus:border-brand-accent-green outline-none bg-white"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1">Kiểu chữ</label>
            <select 
              value={overlay.fontStyle}
              onChange={(e) => dispatch({ type: 'SET_OVERLAY_FONT_STYLE', payload: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-accent-green outline-none bg-white"
            >
              <option value="sans">Hiện đại (Inter)</option>
              <option value="serif">Cổ điển (Playfair Display)</option>
              <option value="cursive">Viết tay (Dancing Script)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1">Hiệu ứng hiển thị AR</label>
            <select 
              value={overlay.textEffect}
              onChange={(e) => dispatch({ type: 'SET_OVERLAY_TEXT_EFFECT', payload: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-accent-green outline-none bg-white"
            >
              <option value="normal">Bình thường</option>
              <option value="neon">Chữ Neon 3D</option>
              <option value="typewriter">Gõ chữ (Typewriter)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-text mb-1">Cỡ chữ: {overlay.fontSize}px</label>
          <input 
            type="range" 
            min="12" 
            max="48" 
            value={overlay.fontSize}
            onChange={(e) => dispatch({ type: 'SET_OVERLAY_FONT_SIZE', payload: parseInt(e.target.value) })}
            className="w-full mt-2 accent-brand-accent-green"
          />
        </div>
        
        <p className="text-xs text-amber-900/60 italic mt-2">
          * Màu sắc và kiểu chữ hiển thị thực tế có thể thay đổi nhẹ sau khi gia công/in ấn.
        </p>
      </div>
    </div>
  );
}
