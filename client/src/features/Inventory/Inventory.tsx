import {
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertCircle,
  X,
  FolderTree
} from 'lucide-react';
import api from '../../services/api';
import CategoryManagement from './CategoryManagement';
import { useState, useEffect } from 'react';

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  sku: string;
  name: string;
  categoryId: string;
  category: Category;
  price: number;
  stock: number;
  minStock: number;
}

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({ sku: '', name: '', categoryId: '', price: 0, stock: 0, minStock: 5 });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products');
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (error) {
      console.error('Error fetching categories');
    }
  };

  const handleCreateProduct = async () => {
    try {
      await api.post('/products', formData);
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      alert('Erro ao criar produto');
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="inventory">
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Estoque</h1>
          <p style={{ color: 'var(--text-muted)' }}>Gerencie seu catálogo de produtos e níveis de reposição.</p>
        </div>
        <div className="flex">
          <button className="btn-secondary flex" onClick={() => setIsCategoryModalOpen(true)}>
            <FolderTree size={18} /> Categorias
          </button>
          <button className="btn-primary flex" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Adicionar Produto
          </button>
        </div>
      </header>

      <div className="glass-card" style={{ marginBottom: '2rem', padding: '1rem' }}>
        <div className="flex" style={{ width: '100%', gap: '1rem' }}>
          <Search size={20} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Buscar por nome ou SKU..."
            style={{ width: '100%', border: 'none', background: 'transparent' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '1.25rem' }}>SKU</th>
              <th style={{ padding: '1.25rem' }}>Produto</th>
              <th style={{ padding: '1.25rem' }}>Categoria</th>
              <th style={{ padding: '1.25rem' }}>Preço</th>
              <th style={{ padding: '1.25rem' }}>Estoque</th>
              <th style={{ padding: '1.25rem' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1.25rem', fontFamily: 'monospace', fontSize: '0.9rem' }}>{product.sku}</td>
                <td style={{ padding: '1.25rem' }}>
                  <div style={{ fontWeight: 600 }}>{product.name}</div>
                </td>
                <td style={{ padding: '1.25rem' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'var(--text-muted)'
                  }}>
                    {product.category?.name || 'Sem Categoria'}
                  </span>
                </td>
                <td style={{ padding: '1.25rem' }}>R$ {product.price.toLocaleString('pt-BR')}</td>
                <td style={{ padding: '1.25rem' }}>
                  <span style={{ fontWeight: 600 }}>{product.stock}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '4px' }}>/ {product.minStock} min</span>
                </td>
                <td style={{ padding: '1.25rem' }}>
                  {product.stock <= product.minStock ? (
                    <span className="flex" style={{ color: 'var(--warning)', fontSize: '0.85rem', fontWeight: 600 }}>
                      <AlertCircle size={14} /> Est. Baixo
                    </span>
                  ) : (
                    <span style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: 600 }}>Normal</span>
                  )}
                </td>
                <td style={{ padding: '1.25rem' }}>
                  <button style={{ background: 'transparent', color: 'var(--text-muted)' }}>
                    <Edit2 size={18} />
                  </button>
                  <button style={{ background: 'transparent', color: 'var(--danger)', marginLeft: '12px' }}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-card animate-fade" style={{ width: '500px' }}>
            <h2>{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h2>
            <div className="grid">
              <input
                type="text"
                placeholder="SKU"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              />
              <input
                type="text"
                placeholder="Nome do Produto"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              >
                <option value="">Selecione uma categoria</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Preço"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              />
              <input
                type="number"
                placeholder="Estoque Inicial"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
              />
              <input
                type="number"
                placeholder="Estoque Mínimo"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
              />
              <div className="flex" style={{ marginTop: '1rem' }}>
                <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button className="btn-primary" style={{ flex: 1 }} onClick={handleCreateProduct}>Salvar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isCategoryModalOpen && (
        <CategoryManagement onClose={() => {
          setIsCategoryModalOpen(false);
          fetchCategories(); // Refresh categories in case any were added/deleted
        }} />
      )}
    </div>
  );
};

export default Inventory;
