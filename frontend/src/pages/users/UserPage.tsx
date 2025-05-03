import { useEffect, useState } from 'react';
import { Table, Card, Popconfirm } from 'antd';
import { getUsers, deleteUser, updateUser } from '../../services/user/userService';
import { SweetAlert } from '../../components/SweetAlert/SweetAlert';
import Title from 'antd/es/typography/Title';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { EditUserModal } from '../../components/EditUserModal/EditUserModal';
import { UpdateUserPayload } from '../../types/user';

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UpdateUserPayload>({} as UpdateUserPayload);

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

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

  const handleDelete = async (id: string) => {
    SweetAlert.loading();
    try {
      await deleteUser(id);
      SweetAlert.success('Sucesso', 'Usuário removido');
      fetchUsers();
    } catch {
      SweetAlert.error('Erro', 'Erro ao remover usuário');
    }
  };

  const handleEditSave = async (updatedUser: UpdateUserPayload) => {
     SweetAlert.loading();
    try {
      await updateUser(selectedUser.id, updatedUser);
      console.log('updatedUser', updatedUser);

      setEditModalOpen(false);
      fetchUsers();

      SweetAlert.success('Sucesso', 'Usuário atualizado');
      fetchUsers();
    } catch {
      SweetAlert.error('Erro', 'Erro ao atualizar usuário');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    { title: 'Nome', dataIndex: 'name', key: 'name' },
    { title: 'E-mail', dataIndex: 'email', key: 'email' },
    { title: 'Função', dataIndex: 'role', key: 'role' },
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
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', gap: 12 }}>
          <EditOutlined
            style={{ color: '#1890ff', cursor: 'pointer' }}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Tem certeza que deseja excluir?"
            okText="Sim"
            cancelText="Não"
            onConfirm={() => handleDelete(record.id)}
          >
            <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} />
          </Popconfirm>
        </div>
      )
    }    
  ];

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '20px' }}>
      <Card>
        <Title level={3}>Usuários Cadastrados no Sistema</Title>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      
          <EditUserModal
            open={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            onSubmit={handleEditSave}
            initialValues={selectedUser || undefined}
          />
        
      </Card>
    </div>
  );
}
