import { useEffect, useState } from 'react';
import { Table, Card } from 'antd';
import { getUsers } from '../../services/user/userService';
import { SweetAlert } from '../../components/SweetAlert/SweetAlert';
import Title from 'antd/es/typography/Title';

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await getUsers();
      setUsers(data.users);
    } catch (err) {
      SweetAlert.error('Erro', 'Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'E-mail',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Função',
      dataIndex: 'role',
      key: 'role'
    },
    {
      title: 'Criado em',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value: string) => new Date(value).toLocaleString('pt-BR'),
    },
    {
      title: 'Atualizado em',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (value: string) => new Date(value).toLocaleString('pt-BR'),
    },
  ];

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '20px' }}>
      <Card >
        <Title level={3}>Usuários Cadastrados no Sistema</Title>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
}
