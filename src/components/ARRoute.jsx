import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ARViewer } from './ARViewer';

export default function ARRoute() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    // Check if user is using Zalo browser
    if (navigator.userAgent.includes('Zalo')) {
      alert("LƯU Ý: Trình duyệt của Zalo thường chặn Camera AR.\n\nHãy nhấn vào dấu 3 chấm (Góc trên cùng bên phải) và chọn 'Mở bằng trình duyệt' (Chrome/Safari) để trải nghiệm AR mượt mà nhất nhé!");
    }

    const fetchOrder = async () => {
      const orderId = searchParams.get('orderId');
      if (!orderId) {
        navigate('/');
        return;
      }

      try {
        const response = await fetch(`/api/orders?id=${orderId}`);
        if (!response.ok) {
          throw new Error('Order not found');
        }
        
        const data = await response.json();
        setOrderData(data);
      } catch (err) {
        console.error(err);
        alert("Không tìm thấy đơn hàng này trên Server!");
        navigate('/');
      }
    };

    fetchOrder();
  }, [searchParams, navigate]);

  if (!orderData) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Đang tải AR...</div>;

  return (
    <ARViewer 
      composedImage={orderData.targetImage} 
      effect={orderData.effect} 
      overlayText={orderData.overlayText}
      overlayFont={orderData.overlayFont}
      onBack={() => navigate('/')} 
    />
  );
}
