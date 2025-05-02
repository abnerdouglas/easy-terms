import { useEffect, useState } from 'react';
import { Table, Form, Input, Select, Button, message, Card } from 'antd';
import { createUser, getUsers } from '../../services/user/userService';

const { Option } = Select;

export default function UserPage() {
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await getUsers();

      // Se a API retorna { data: [...] }
      setUsers(data.users); // compatível com ambas formas
    } catch (err) {
      message.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    try {
      await createUser(values);
      message.success('Usuário criado com sucesso');
      form.resetFields();
      fetchUsers();
    } catch {
      message.error('Erro ao criar usuário');
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
      title: 'Data de Criação',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value: string) => new Date(value).toLocaleString('pt-BR'),
    },
    {
      title: 'Data de Atualização',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value: string) => new Date(value).toLocaleString('pt-BR'),
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
      <Card title="Cadastrar Novo Usuário" style={{ marginBottom: 24 }}>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item label="Nome" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="E-mail" name="email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Senha" name="password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item label="Função" name="role" rules={[{ required: true }]}>
            <Select placeholder="Selecione uma função">
              <Option value="ADMIN">Adminitrador</Option>
              <Option value="EMPLOYEE">Funcionário</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary">Salvar</Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Usuários Cadastrados">
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
