import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Bell, 
  LogOut,
  Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/inventory', icon: Package, label: 'Estoque' },
    { to: '/sales', icon: ShoppingCart, label: 'Vendas (PDV)' },
    { to: '/reports', icon: BarChart3, label: 'Relatórios' },
  ];

  if (user?.role === 'ADMIN') {
    navItems.push({ to: '/admin', icon: Settings, label: 'Configurações' });
  }

  return (
    <aside className="sidebar glass-card" style={{ height: 'calc(100vh - 2rem)', width: '280px', margin: '1rem', display: 'flex', flexDirection: 'column' }}>
      <div className="logo" style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}>
        <h2 style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--primary)', borderRadius: '8px' }}></div>
          Fluxora
        </h2>
      </div>

      <nav style={{ flex: 1, padding: '0.5rem' }}>
        {navItems.map((item) => (
          <NavLink 
            key={item.to} 
            to={item.to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: 'var(--radius)',
              color: isActive ? 'white' : 'var(--text-muted)',
              background: isActive ? 'var(--primary)' : 'transparent',
              textDecoration: 'none',
              marginBottom: '4px',
              transition: 'all 0.2s',
              fontWeight: isActive ? '600' : '400'
            })}
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="user-profile" style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.name}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{user?.role}</p>
        </div>
        <button 
          onClick={logout}
          className="btn-secondary"
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px' }}
        >
          <LogOut size={18} /> Sair
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
