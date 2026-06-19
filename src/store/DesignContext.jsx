import { createContext, useReducer, useContext } from 'react';
import { initialState, designReducer } from './designReducer';

const DesignContext = createContext(null);
const DesignDispatchContext = createContext(null);

export function DesignProvider({ children }) {
  const [state, dispatch] = useReducer(designReducer, initialState);

  return (
    <DesignContext.Provider value={state}>
      <DesignDispatchContext.Provider value={dispatch}>
        {children}
      </DesignDispatchContext.Provider>
    </DesignContext.Provider>
  );
}

export function useDesign() {
  return useContext(DesignContext);
}

export function useDesignDispatch() {
  return useContext(DesignDispatchContext);
}
