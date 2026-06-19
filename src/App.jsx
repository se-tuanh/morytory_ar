import { Routes, Route } from 'react-router-dom';
import { DesignProvider } from './store/DesignContext';
import { CartProvider } from './store/CartContext';
import HomePage from './components/HomePage';
import DesignPage from './components/DesignPage';
import ARRoute from './components/ARRoute';
import CartIcon from './components/CartIcon';
import CartModal from './components/CartModal';

function App() {
  return (
    <CartProvider>
      <DesignProvider>
        <CartIcon />
        <CartModal />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/design" element={<DesignPage />} />
          <Route path="/ar" element={<ARRoute />} />
        </Routes>
      </DesignProvider>
    </CartProvider>
  );
}

export default App;
