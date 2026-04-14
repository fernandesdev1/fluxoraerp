import React, { useEffect, useState } from 'react';
import { 
  FolderPlus, 
  Edit3, 
  Trash2, 
  X,
  Plus
} from 'lucide-react';
import api from '../../services/api';

interface Category {
  id: string;
  name: string;
  _count?: {
    products: number;
  };
}

const CategoryManagement: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      setError('Erro ao carregar categorias.');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      await api.post('/categories', { name: newCatName });
      setNewCatName('');
      fetchCategories();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao criar categoria.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erro ao deletar categoria.');
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
      <div className="glass-card animate-fade" style={{ width: '450px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
        <header className="flex" style={{ justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 className="flex"><FolderPlus size={24} /> Categorias</h2>
          <button onClick={onClose} style={{ background: 'transparent' }}><X /></button>
        </header>

        {error && <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginBottom: '1rem' }}>{error}</p>}

        <form onSubmit={handleCreate} className="flex" style={{ marginBottom: '2rem' }}>
          <input 
            type="text" 
            placeholder="Nova categoria..." 
            style={{ flex: 1 }}
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
          />
          <button type="submit" className="btn-primary" style={{ padding: '0.75rem' }}><Plus size={20} /></button>
        </form>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {categories.map(cat => (
            <div key={cat.id} className="flex" style={{ justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <p style={{ fontWeight: 600 }}>{cat.name}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{cat._count?.products || 0} produtos vinculados</p>
              </div>
              <div className="flex">
                <button 
                  onClick={() => handleDelete(cat.id)}
                  style={{ background: 'transparent', color: 'var(--danger)' }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;
