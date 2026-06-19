import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronUp, ChevronDown } from 'lucide-react';
import LeftColumnPreview from './LeftColumnPreview';
import Step1Upload from './Step1Upload';
import Step2FrameSize from './Step2FrameSize';
import Step3ARSelection from './Step3ARSelection';
import Step4MusicSelection from './Step4MusicSelection';
import Step4AREditor from './Step4AREditor';
import Step5Summary from './Step5Summary';
import { useDesign, useDesignDispatch } from '../store/DesignContext';
import { useCartDispatch } from '../store/CartContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronUp, ChevronDown } from 'lucide-react';
import LeftColumnPreview from './LeftColumnPreview';
import Step1Upload from './Step1Upload';
import Step2FrameSize from './Step2FrameSize';
import Step3ARSelection from './Step3ARSelection';
import Step4MusicSelection from './Step4MusicSelection';
import Step4AREditor from './Step4AREditor';
import Step5Summary from './Step5Summary';
import { useDesign, useDesignDispatch } from '../store/DesignContext';
import { useCartDispatch } from '../store/CartContext';
import { loadDraft, clearDraft } from '../store/draftService';

export default function DesignPage() {
  const navigate = useNavigate();
  const [isPreviewCollapsed, setIsPreviewCollapsed] = useState(false);
  const [draftExists, setDraftExists] = useState(null);
  const { selectedAREffect, photoPreviewUrl, overlay, frameSize, pricing, photo, music, purchaseMode } = useDesign();
  const designDispatch = useDesignDispatch();
  const cartDispatch = useCartDispatch();

  useEffect(() => {
    loadDraft().then(draft => {
      if (draft) {
        setDraftExists(draft);
      }
    });
  }, []);

  const restoreDraft = () => {
    if (draftExists) {
      designDispatch({ type: 'LOAD_DRAFT', payload: draftExists });
      setDraftExists(null);
    }
  };

  const handleAddToCart = async () => {
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      purchaseMode,
      photoPreviewUrl,
      photo,
      frameSize,
      selectedAREffect: purchaseMode === 'ar_frame' ? selectedAREffect : null,
      music: purchaseMode === 'ar_frame' ? music : null,
      overlay: purchaseMode === 'ar_frame' ? overlay : null,
      pricing
    };
    cartDispatch({ type: 'ADD_ITEM', payload: newItem });
    designDispatch({ type: 'RESET_DESIGN' });
    await clearDraft();
    cartDispatch({ type: 'SET_CART_OPEN', payload: true });
  };

  const isAddToCartDisabled = purchaseMode === 'ar_frame' && !photoPreviewUrl;
  const addToCartText = purchaseMode === 'frame_only' 
    ? "Thêm khung vào giỏ hàng" 
    : (!photoPreviewUrl ? "Vui lòng tải ảnh lên" : "Thêm vào giỏ hàng");

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans flex flex-col md:flex-row">
      {/* Mobile Header with Back Button */}
      <div className="md:hidden flex items-center h-16 px-4 bg-white border-b border-brand-accent-beige sticky top-0 z-40">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-full transition-colors -ml-2">
          <ArrowLeft className="w-5 h-5 text-brand-text" />
        </button>
        <span className="ml-2 font-serif font-bold text-brand-wood text-lg">MoryTory</span>
      </div>

      {/* Left Column (Preview) */}
      <div 
        className={`md:w-1/2 sticky top-16 md:top-0 z-30 md:h-screen flex flex-col bg-brand-bg transition-all duration-300 ease-in-out border-b md:border-none border-brand-accent-beige shadow-sm md:shadow-none ${
          isPreviewCollapsed ? 'h-16 overflow-hidden' : 'h-auto'
        }`}
      >
        <div className="relative flex-1 p-2 md:p-4 flex items-center justify-center">
          {/* Desktop Back Button */}
          <button 
            onClick={() => navigate('/')} 
            className="hidden md:flex absolute top-6 left-6 items-center gap-2 text-gray-500 hover:text-brand-text transition-colors z-10"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại Trang chủ</span>
          </button>
          
          <LeftColumnPreview />
        </div>
        
        {/* Mobile Collapse Toggle */}
        <button 
          className="md:hidden flex items-center justify-center py-2 bg-white border-t border-brand-accent-beige text-gray-500 hover:text-brand-wood z-20 text-sm"
          onClick={() => setIsPreviewCollapsed(!isPreviewCollapsed)}
        >
          {isPreviewCollapsed ? (
            <><ChevronDown className="w-4 h-4 mr-1" /> Hiển thị xem trước</>
          ) : (
            <><ChevronUp className="w-4 h-4 mr-1" /> Thu gọn xem trước</>
          )}
        </button>
      </div>

      {/* Right Column (Control Panel) */}
      <div className="md:w-1/2 flex-1 md:overflow-y-auto md:h-screen bg-white md:shadow-[-10px_0_20px_-10px_rgba(0,0,0,0.05)] pb-32">
        <div className="max-w-xl mx-auto p-6 md:p-12 space-y-10">
          <div>
            <h2 className="text-3xl font-serif font-bold text-brand-text mb-2">Thiết Kế Khung Ảnh</h2>
            <p className="text-gray-500">Tùy chỉnh khung ảnh gỗ và lưu giữ kỷ niệm của bạn.</p>
          </div>
          
          {draftExists && (
            <div className="bg-brand-bg border border-brand-accent-beige p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4">
              <span className="text-sm text-brand-wood font-medium">Bạn có một bản thiết kế đang làm dở.</span>
              <div className="flex gap-2 w-full md:w-auto">
                <button onClick={() => { setDraftExists(null); clearDraft(); }} className="flex-1 md:flex-none text-sm text-brand-wood px-4 py-2 hover:bg-brand-accent-beige rounded-lg font-medium transition-colors">Làm mới</button>
                <button onClick={restoreDraft} className="flex-1 md:flex-none text-sm bg-brand-wood text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors shadow-sm">Tiếp tục</button>
              </div>
            </div>
          )}

          <Step1Upload />
          <Step2FrameSize />
          {purchaseMode === 'ar_frame' && (
            <>
              <Step3ARSelection />
              <Step4MusicSelection />
              <Step4AREditor />
            </>
          )}
        </div>
      </div>

      {/* Summary Bar */}
      <Step5Summary 
        onOrder={handleAddToCart} 
        buttonText={addToCartText} 
        disabled={isAddToCartDisabled} 
      />
    </div>
  );
}
