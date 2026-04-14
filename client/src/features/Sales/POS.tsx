import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Minus, 
  Trash2, 
  Search, 
  CreditCard, 
  ShoppingCart,
  CheckCircle2
} from 'lucide-react';
import api from '../../services/api';

interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  stock: number;
}

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

const POS: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await api.get('/products');
    setProducts(res.data);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item => 
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { productId: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    try {
      await api.post('/sales', {
        items: cart,
        totalAmount: total
      });
      setCart([]);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
      fetchProducts();
    } catch (error) {
      alert('Falha ao processar venda');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pos-container" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 400px', gap: '1.5rem', height: '100%' }}>
      <div className="catalog">
        <header style={{ marginBottom: '1.5rem' }}>
          <h1>Ponto de Venda</h1>
          <div className="glass-card flex" style={{ marginTop: '1rem', padding: '0.75rem 1rem' }}>
            <Search size={18} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Pesquisar produtos (Nome ou SKU)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: 'transparent', border: 'none', width: '100%' }}
            />
          </div>
        </header>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
          {filteredProducts.map(product => (
            <div key={product.id} className="glass-card animate-fade" style={{ padding: '1rem' }}>
              <h4 style={{ marginBottom: '0.5rem' }}>{product.name}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{product.sku}</p>
              <div className="flex" style={{ justifyContent: 'space-between', marginTop: '1rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>R$ {product.price}</span>
                <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Stock: {product.stock}</span>
              </div>
              <button 
                className="btn-primary" 
                style={{ width: '100%', marginTop: '1rem', padding: '0.5rem' }}
                onClick={() => addToCart(product)}
                disabled={product.stock <= 0}
              >
                {product.stock <= 0 ? 'Indisponível' : 'Adicionar'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="cart-sidebar glass-card" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 4rem)' }}>
        <h3 className="flex"><ShoppingCart size={20} /> Carrinho</h3>
        
        <div className="cart-items" style={{ flex: 1, overflowY: 'auto', margin: '1.5rem 0' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '3rem' }}>
              Carrinho vazio
            </div>
          ) : (
            cart.map(item => (
              <div key={item.productId} style={{ marginBottom: '1rem', padding: '0.5rem', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600 }}>{item.name}</span>
                  <button onClick={() => removeFromCart(item.productId)} style={{ background: 'transparent', color: 'var(--danger)' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex" style={{ justifyContent: 'space-between' }}>
                  <div className="flex" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '4px' }}>
                    <button onClick={() => updateQuantity(item.productId, -1)} style={{ background: 'transparent' }}><Minus size={14} /></button>
                    <span style={{ minWidth: '24px', textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, 1)} style={{ background: 'transparent' }}><Plus size={14} /></button>
                  </div>
                  <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer" style={{ borderTop: '2px dashed var(--border)', paddingTop: '1.5rem' }}>
          <div className="flex" style={{ justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 700 }}>
            <span>Total</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
          <button 
            className="btn-primary" 
            style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}
            disabled={cart.length === 0}
            onClick={handleCheckout}
          >
            Finalizar Venda
          </button>
        </div>
      </div>

      {isSuccess && (
        <div style={{ position: 'fixed', top: '2rem', right: '2rem', background: 'var(--success)', padding: '1rem 2rem', borderRadius: 'var(--radius)', color: 'white', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }} className="animate-fade">
          <CheckCircle2 /> Venda realizada com sucesso!
        </div>
      )}
    </div>
  );
};

export default POS;
