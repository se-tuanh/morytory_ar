import { useDesign, useDesignDispatch } from '../store/DesignContext';
import { AR_EFFECTS } from '../data/arEffects';

export default function Step3ARSelection() {
  const { selectedAREffect } = useDesign();
  const dispatch = useDesignDispatch();

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-brand-text">3. Chọn hiệu ứng AR</h3>
      
      <div className="grid grid-cols-1 gap-3">
        {/* Option: None */}
        <button
          type="button"
          onClick={() => dispatch({ type: 'SET_AR_EFFECT', payload: null })}
          className={`p-4 rounded-xl text-left transition-all duration-300 ease-in-out border flex items-center justify-between ${
            selectedAREffect === null
              ? 'bg-brand-wood text-white scale-[1.01] shadow-md border-transparent' 
              : 'bg-white border border-brand-wood/20 text-brand-text hover:border-brand-wood/50'
          }`}
        >
          <div>
            <div className="font-semibold">Không sử dụng</div>
            <div className={`text-sm mt-0.5 ${selectedAREffect === null ? 'text-white/80' : 'text-gray-500'}`}>
              Chỉ in khung ảnh truyền thống
            </div>
          </div>
          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
            selectedAREffect === null ? 'bg-white border-white text-brand-wood' : 'border-gray-300'
          }`}>
            {selectedAREffect === null && <div className="w-2.5 h-2.5 rounded-full bg-brand-wood" />}
          </div>
        </button>

        {AR_EFFECTS.map((effect) => {
          const isSelected = selectedAREffect === effect.id;
          return (
            <button
              key={effect.id}
              type="button"
              onClick={() => dispatch({ type: 'SET_AR_EFFECT', payload: effect.id })}
              className={`p-4 rounded-xl text-left transition-all duration-300 ease-in-out border flex items-center justify-between ${
                isSelected 
                  ? 'bg-brand-wood text-white scale-[1.01] shadow-md border-transparent' 
                  : 'bg-white border border-brand-wood/20 text-brand-text hover:border-brand-wood/50'
              }`}
            >
              <div>
                <div className="font-semibold">{effect.name}</div>
                <div className={`text-sm mt-0.5 ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                  {effect.desc}
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                isSelected ? 'bg-white border-white text-brand-wood' : 'border-gray-300'
              }`}>
                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-brand-wood" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
