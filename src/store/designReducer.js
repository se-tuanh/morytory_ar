export const initialState = {
  isPrintingPhoto: false,
  photo: null,           // File object
  photoPreviewUrl: null, // URL.createObjectURL result
  frameSize: '10x15',    // Default
  selectedAREffect: null, // 'snow' | 'sparkle' | 'petals' | 'balloon-3d' | null
  music: null,           // music url or null
  overlay: { text: '', fontStyle: 'serif', fontSize: 16, textEffect: 'normal' },
  pricing: { base: 35000, arAddon: 5000, total: 35000 },
};

const getBasePrice = (size) => {
  if (size === '15x21') return 45000;
  if (size === '13x18') return 40000;
  return 35000;
};

const calculateTotal = (size, arEffect) => {
  const base = getBasePrice(size);
  if (!arEffect) return base;
  return arEffect === 'balloon-3d' ? base + 15000 : base + 5000;
};

export function designReducer(state, action) {
  switch (action.type) {
    case 'SET_PRINTING_PHOTO': {
      const isPrintingPhoto = action.payload;
      return { 
        ...state, 
        isPrintingPhoto
      };
    }
    case 'SET_PHOTO':
      return { ...state, photo: action.payload.file, photoPreviewUrl: action.payload.url };
    case 'SET_FRAME_SIZE': {
      const size = action.payload;
      const base = getBasePrice(size);
      const total = calculateTotal(size, state.selectedAREffect);
      return { 
        ...state, 
        frameSize: size,
        pricing: { ...state.pricing, base, total }
      };
    }
    case 'SET_AR_EFFECT': {
      const selectedAREffect = action.payload;
      const total = calculateTotal(state.frameSize, selectedAREffect);
      return { 
        ...state, 
        selectedAREffect, 
        pricing: { ...state.pricing, total }
      };
    }
    case 'SET_MUSIC':
      return { ...state, music: action.payload };
    case 'SET_OVERLAY_TEXT':
      return { ...state, overlay: { ...state.overlay, text: action.payload } };
    case 'SET_OVERLAY_FONT_STYLE':
      return { ...state, overlay: { ...state.overlay, fontStyle: action.payload } };
    case 'SET_OVERLAY_FONT_SIZE':
      return { ...state, overlay: { ...state.overlay, fontSize: action.payload } };
    case 'SET_OVERLAY_TEXT_EFFECT':
      return { ...state, overlay: { ...state.overlay, textEffect: action.payload } };
    case 'LOAD_DRAFT':
      return { ...state, ...action.payload };
    case 'RESET_DESIGN':
      return initialState;
    default:
      return state;
  }
}
