import React, { useEffect, useState } from 'react';
import { 
  UserPlus, 
  Users, 
  Shield, 
  Mail, 
  Key,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import api from '../../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'EMPLOYEE';
  createdAt: string;
}

const AdminSettings: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'EMPLOYEE' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/users');
      setUsers(res.data);
    } catch (err) {
      setError('Apenas administradores podem acessar esta página.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/auth/register', formData);
      setSuccess('Usuário criado com sucesso!');
      setShowAddModal(false);
      setFormData({ name: '', email: '', password: '', role: 'EMPLOYEE' });
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Falha ao criar usuário.');
    }
  };

  return (
    <div className="admin-settings">
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Configurações do Sistema</h1>
          <p style={{ color: 'var(--text-muted)' }}>Gerencie usuários, permissões e parâmetros operacionais.</p>
        </div>
        <button className="btn-primary flex" onClick={() => setShowAddModal(true)}>
          <UserPlus size={18} /> Novo Usuário
        </button>
      </header>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '1rem', border: '1px solid var(--danger)' }}>
          <AlertCircle size={18} style={{ marginRight: '8px' }} /> {error}
        </div>
      )}

      {success && (
        <div style={{ background: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)', padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '1rem', border: '1px solid var(--success)' }}>
          <CheckCircle2 size={18} style={{ marginRight: '8px' }} /> {success}
        </div>
      )}

      <div className="grid" style={{ gridTemplateColumns: '1fr 2fr' }}>
        <div className="glass-card">
          <h3 style={{ marginBottom: '1.5rem' }}>Perfil da Empresa</h3>
          <div className="grid">
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Nome da Empresa</label>
              <input type="text" value="Fluxora ERP Ltda" readOnly style={{ width: '100%', opacity: 0.6 }} />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>CNPJ</label>
              <input type="text" value="00.000.000/0001-00" readOnly style={{ width: '100%', opacity: 0.6 }} />
            </div>
          </div>
        </div>

        <div className="glass-card">
          <h3 style={{ marginBottom: '1.5rem' }}>Gerenciamento de Usuários</h3>
          <div className="user-list">
            {users.map(user => (
              <div key={user.id} className="flex" style={{ justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid var(--border)' }}>
                <div className="flex">
                  <div style={{ width: '40px', height: '40px', background: 'var(--bg-nav)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={20} color="var(--primary)" />
                  </div>
                  <div>
                    <p style={{ fontWeight: 600 }}>{user.name}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.email}</p>
                  </div>
                </div>
                <div className="flex">
                  <span style={{ 
                    fontSize: '0.75rem', 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    background: user.role === 'ADMIN' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.05)',
                    color: user.role === 'ADMIN' ? 'var(--primary)' : 'var(--text-muted)',
                    fontWeight: 700
                  }}>
                    {user.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-card animate-fade" style={{ width: '450px' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Adicionar Novo Usuário</h2>
            <form onSubmit={handleSubmit} className="grid">
              <div className="flex" style={{ width: '100%' }}>
                <Users size={18} color="var(--text-muted)" />
                <input 
                  type="text" 
                  placeholder="Nome Completo" 
                  style={{ width: '100%' }}
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="flex" style={{ width: '100%' }}>
                <Mail size={18} color="var(--text-muted)" />
                <input 
                  type="email" 
                  placeholder="E-mail" 
                  style={{ width: '100%' }}
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="flex" style={{ width: '100%' }}>
                <Key size={18} color="var(--text-muted)" />
                <input 
                  type="password" 
                  placeholder="Senha Inicial" 
                  style={{ width: '100%' }}
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <div className="flex" style={{ width: '100%' }}>
                <Shield size={18} color="var(--text-muted)" />
                <select 
                  style={{ width: '100%' }}
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="EMPLOYEE">Funcionário</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>
              <div className="flex" style={{ marginTop: '1rem' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Criar Usuário</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
