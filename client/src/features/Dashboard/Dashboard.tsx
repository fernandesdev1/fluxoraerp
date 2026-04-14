import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  Package, 
  AlertTriangle, 
  DollarSign, 
  ArrowUpRight 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  revenue: number;
  salesCount: number;
  revenueTrend: string;
  salesTrend: string;
  topProducts: Array<{ name: string, totalSold: number }>;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [newItemsCount, setNewItemsCount] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await api.get('/sales/dashboard');
        const productStatsRes = await api.get('/products/stats');
        setStats(statsRes.data);
        setLowStockCount(productStatsRes.data.lowStockCount);
        setNewItemsCount(productStatsRes.data.newItemsCount);
        setTotalProducts(productStatsRes.data.totalProducts);
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      }
    };
    fetchData();
  }, []);

  const cards = [
    { 
      title: 'Receita Total', 
      value: `R$ ${stats?.revenue.toLocaleString('pt-BR') || 0}`, 
      icon: DollarSign, 
      color: '#6366f1', 
      trend: `${Number(stats?.revenueTrend) >= 0 ? '+' : ''}${stats?.revenueTrend || 0}%` 
    },
    { 
      title: 'Vendas Realizadas', 
      value: stats?.salesCount || 0, 
      icon: TrendingUp, 
      color: '#ec4899', 
      trend: `${Number(stats?.salesTrend) >= 0 ? '+' : ''}${stats?.salesTrend || 0}%` 
    },
    { 
      title: 'Produtos em Alerta', 
      value: lowStockCount, 
      icon: AlertTriangle, 
      color: '#f59e0b', 
      trend: lowStockCount > 0 ? 'Ação necessária' : 'Tudo em dia' 
    },
    { 
      title: 'Total de Itens', 
      value: totalProducts, 
      icon: Package, 
      color: '#22c55e', 
      trend: `+${newItemsCount} novos` 
    },
  ];

  const getTrendColor = (trend: string, title: string) => {
    if (title === 'Produtos em Alerta') return trend === 'Tudo em dia' ? 'var(--success)' : 'var(--warning)';
    if (trend.includes('+')) return 'var(--success)';
    if (trend.includes('-')) return 'var(--danger)';
    return 'var(--text-muted)';
  };

  return (
    <div className="dashboard">
      <header style={{ marginBottom: '2rem' }}>
        <h1>Visão Geral</h1>
        <p style={{ color: 'var(--text-muted)' }}>Bem-vindo de volta! Aqui está o que está acontecendo hoje.</p>
      </header>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', marginBottom: '2rem' }}>
        {cards.map((card, i) => (
          <div key={i} className="glass-card animate-fade" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="flex" style={{ justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ padding: '8px', background: `${card.color}20`, borderRadius: '8px', color: card.color }}>
                <card.icon size={24} />
              </div>
              <span style={{ fontSize: '0.8rem', color: getTrendColor(card.trend, card.title), fontWeight: 600 }}>
                {card.trend}
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{card.title}</p>
            <h2 style={{ fontSize: '1.8rem', marginTop: '0.25rem' }}>{card.value}</h2>
          </div>
        ))}
      </div>

      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div className="glass-card">
          <h3 style={{ marginBottom: '1.5rem' }}>Top Produtos Vendidos</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.topProducts || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ background: '#1e293b', border: '1px solid var(--border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'white' }}
                />
                <Bar dataKey="totalSold" radius={[4, 4, 0, 0]}>
                  {(stats?.topProducts || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? 'var(--primary)' : 'rgba(99, 102, 241, 0.4)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card">
          <h3 style={{ marginBottom: '1.5rem' }}>Início Rápido</h3>
          <div className="grid" style={{ gap: '1rem' }}>
            <button 
              className="btn-secondary" 
              style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}
              onClick={() => navigate('/sales')}
            >
              <span>Nova Venda</span>
              <ArrowUpRight size={18} />
            </button>
            <button 
              className="btn-secondary" 
              style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}
              onClick={() => navigate('/inventory')}
            >
              <span>Adicionar Produto</span>
              <ArrowUpRight size={18} />
            </button>
            <button 
              className="btn-secondary" 
              style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}
              onClick={() => navigate('/reports')}
            >
              <span>Gerar Relatório</span>
              <ArrowUpRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
