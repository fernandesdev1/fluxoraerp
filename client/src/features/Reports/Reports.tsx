import React, { useEffect, useState } from 'react';
import { 
  Download, 
  Filter, 
  Calendar, 
  ChevronDown,
  FileJson
} from 'lucide-react';
import api from '../../services/api';

interface SaleReport {
  id: string;
  date: string;
  total: number;
  seller: string;
  itemsCount: number;
}

const Reports: React.FC = () => {
  const [sales, setSales] = useState<SaleReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await api.get('/sales/history');
      // Mapping the detailed history to a simpler report view
      const mapped = res.data.map((s: any) => ({
        id: s.id,
        date: s.createdAt,
        total: s.totalAmount,
        seller: s.user.name,
        itemsCount: s.items.length
      }));
      setSales(mapped);
    } catch (error) {
      console.error('Error fetching reports');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const res = await api.get('/sales/export');
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `fluxora-report-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert('Apenas administradores podem exportar relatórios.');
    }
  };

  return (
    <div className="reports-page">
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Relatórios de Vendas</h1>
          <p style={{ color: 'var(--text-muted)' }}>Analise o desempenho e exporte dados históricos.</p>
        </div>
        <button className="btn-primary flex" onClick={handleExport}>
          <Download size={18} /> Exportar Dados
        </button>
      </header>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '2rem' }}>
        <div className="glass-card flex" style={{ justifyContent: 'space-between' }}>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Vendas no Período</p>
            <h3>{sales.length}</h3>
          </div>
          <Calendar size={20} color="var(--primary)" />
        </div>
        <div className="glass-card flex" style={{ justifyContent: 'space-between' }}>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Volume Total</p>
            <h3>R$ {sales.reduce((acc, s) => acc + s.total, 0).toLocaleString('pt-BR')}</h3>
          </div>
          <FileJson size={20} color="var(--secondary)" />
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Filter size={18} color="var(--text-muted)" />
        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Filtrar por:</span>
        <button className="btn-secondary flex" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
          Últimos 30 dias <ChevronDown size={14} />
        </button>
        <button className="btn-secondary flex" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
          Todos Vendedores <ChevronDown size={14} />
        </button>
      </div>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '1.25rem' }}>ID da Venda</th>
              <th style={{ padding: '1.25rem' }}>Data</th>
              <th style={{ padding: '1.25rem' }}>Vendedor</th>
              <th style={{ padding: '1.25rem' }}>Itens</th>
              <th style={{ padding: '1.25rem' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</td></tr>
            ) : sales.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center' }}>Nenhuma venda encontrada.</td></tr>
            ) : (
              sales.map((sale) => (
                <tr key={sale.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1.25rem', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                    #{sale.id.slice(0, 8)}...
                  </td>
                  <td style={{ padding: '1.25rem' }}>
                    {new Date(sale.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td style={{ padding: '1.25rem' }}>{sale.seller}</td>
                  <td style={{ padding: '1.25rem' }}>{sale.itemsCount} itens</td>
                  <td style={{ padding: '1.25rem', fontWeight: 600, color: 'var(--success)' }}>
                    R$ {sale.total.toLocaleString('pt-BR')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
