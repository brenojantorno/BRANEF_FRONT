import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TabelaEmpresas.css'; // Importando o CSS
import { Skeleton } from 'antd';

interface Empresa {
  id: string;
  nome: string;
  porte: number;
}

const App: React.FC = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [nome, setNome] = useState('');
  const [Porte, setPorte] = useState(1);
  const [editandoId, setEditandoId] = useState<string | null>(null);

  const apiUrl = process.env.REACT_APP_BASE_URL;
  useEffect(() => {
    fetchEmpresas();
  }, []);

  const fetchEmpresas = async () => {
    try {
      const response = await axios.get(`${apiUrl}/Api/Empresa`);
      setEmpresas(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
    }
  };

  const adicionarEmpresa = async () => {
    if (nome) {
      try {
        setLoading(true);
        await axios.post(`${apiUrl}/Api/Empresa`, { nome, Porte });
        fetchEmpresas();
        setNome('');
        setPorte(1);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao adicionar empresa:', error);
      }
    }
  };

  const editarEmpresa = async () => {
    if (editandoId !== null && nome) {
      try {
        setLoading(true);
        await axios.put(`${apiUrl}/Api/Empresa/`, { id: editandoId, nome, Porte });
        fetchEmpresas();
        setNome('');
        setPorte(1);
        setEditandoId(null);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao editar empresa:', error);
      }
    }
  };

  const cancelarEdicao = async () => {
    setNome('');
    setPorte(1);
    setEditandoId(null);
  };

  const excluirEmpresa = async (id: string) => {
    try {
      setLoading(true);
      await axios.delete(`${apiUrl}/Api/Empresa/${id}`);
      fetchEmpresas();
      setLoading(false);
    } catch (error) {
      console.error('Erro ao excluir empresa:', error);
    }
  };

  const handleEdit = (empresa: Empresa) => {
    setNome(empresa.nome);
    setPorte(empresa.porte);
    setEditandoId(empresa.id);
  };

  return (
    <div className="table-container">
      <h1>Tabela de Clientes</h1>
      <form>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome da Empresa"
        />
        <select value={Porte} onChange={(e) => setPorte(Number(e.target.value))}>
          <option value={1}>Pequena</option>
          <option value={2}>Média</option>
          <option value={3}>Grande</option>
        </select>
        {editandoId ? (
          <>
            <button type="button" onClick={editarEmpresa}>Salvar Edição</button>
            <button type="button" onClick={cancelarEdicao}>Cancelar Edição</button>
          </>
        ) : (
          <button type="button" onClick={adicionarEmpresa}>Adicionar Cliente</button>
        )}
      </form>

      {
        loading ? <Skeleton active /> :
          <table>
            <colgroup>
              <col style={{ width: '40%' }} />
              <col style={{ width: '40%' }} />
              <col style={{ width: '20%' }} />
            </colgroup>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Porte</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {empresas.map((empresa) => (
                <tr key={empresa.id}>
                  <td>{empresa.nome}</td>
                  <td>{empresa.porte === 1 ? 'Pequena' : empresa.porte === 2 ? 'Média' : 'Grande'}</td>
                  <td>
                    <button onClick={() => handleEdit(empresa)}>Editar</button>
                    <button onClick={() => excluirEmpresa(empresa.id)}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      }
    </div>
  );
};

export default App;
