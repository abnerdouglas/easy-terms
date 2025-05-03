import { useEffect, useState } from 'react';
import { Table, Form, Input, Select, Button, Card, Checkbox } from 'antd';
import { createUser, getUsers } from '../../services/user/userService';
import { getTerms } from '../../services/term/termService';
import { CreateUserPayload } from '../../types/user';
import { SweetAlert } from '../../components/SweetAlert/SweetAlert';

const { Option } = Select;

export default function UserPage() {
  const [form] = Form.useForm();
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

  const fetchTerms = async () => {
    setLoading(true);
    try {
      const { data } = await getTerms();
      setTerms(data.terms);
    } catch {
      SweetAlert.error('Erro', 'Erro ao carregar termos de consentimento');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: CreateUserPayload) => {
    SweetAlert.loading();
    try {
      await createUser(values);

      if(values.acceptedTermIds.length > 0) {
        await SweetAlert.warning('Atenção', 'Os Termos de consentimento devem ser lidos e aceitos pelo usuário via email!');
      }

      await SweetAlert.success('Sucesso', 'Usuário criado com sucesso!');

      form.resetFields();
      fetchUsers();

    } catch (error: any) {

      const apiError = error?.response?.data;

      const errorMessages = Array.isArray(apiError?.message)
        ? apiError.message.join('<br/>') // quebra de linha no HTML
        : apiError?.message || 'Erro ao criar usuário';

      SweetAlert.error('Erro', errorMessages);

    }
  };

  useEffect(() => {
    fetchUsers();
    fetchTerms();
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
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
      <Card title="Cadastrar Novo Usuário" style={{ marginBottom: 24 }}>
        <Form form={form} onFinish={onSubmit} layout="vertical">

          <Form.Item
            label="Nome"
            name="name"
            rules={[{ required: true, message: 'Por favor, insira o nome.' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="E-mail"
            name="email"
            rules={[
              { required: true, message: 'Por favor, insira o e-mail.' },
              { type: 'email', message: 'Formato de e-mail inválido.' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Senha"
            name="password"
            rules={[{ required: true, message: 'Por favor, insira a senha.' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Função"
            name="role"
            rules={[{ required: true, message: 'Por favor, selecione uma função.' }]}
          >
            <Select placeholder="Selecione uma função">
              <Option value="ADMIN">Administrador</Option>
              <Option value="EMPLOYEE">Funcionário</Option>
            </Select>
          </Form.Item>


          <Form.Item
            label="Termos de consentimento"
            name="acceptedTermIds"
            initialValue={[]}
          >
            <Checkbox.Group style={{ display: 'flex', flexDirection: 'column' }}>
              {terms.map((term: any) => (
                <Checkbox key={term.id} value={term.id} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <strong>{term.title} (v{term.version})</strong>
                    <span style={{ fontSize: 12, color: '#555' }}>{term.content}</span>
                  </div>
                </Checkbox>
              ))}
            </Checkbox.Group>
          </Form.Item>

          <Form.Item>
            <Button htmlType="submit" type="primary">
              Salvar
            </Button>
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
