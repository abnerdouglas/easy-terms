import { useEffect, useState } from 'react';
import { Table, Form, Input, Switch, Button, Card, Tag } from 'antd';
import { createTerm, getTerms, updateTerm, deleteTerm } from '../../services/term/termService';
import { CreateTermPayload, UpdateTermPayload } from '../../types/term';
import { SweetAlert } from '../../components/SweetAlert/SweetAlert';
import { EditTermModal } from '../../components/EditTermModal/EditTermModal';
import { Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

export default function TermsPage() {
  const [form] = Form.useForm();
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<UpdateTermPayload>({} as UpdateTermPayload);

  const handleEdit = (term: any) => {
    setSelectedTerm(term);
    setEditModalOpen(true);
  };

  const handleUpdateTerm = async (values: UpdateTermPayload) => {
    SweetAlert.loading();
    
    try {
      await updateTerm(selectedTerm.id, values); // ou `updateTerm` se tiver
      SweetAlert.success('Atualizado com sucesso!', 'O termo foi atualizado.');
      setEditModalOpen(false);
      fetchTerms();
    } catch {
      SweetAlert.error('Erro ao atualizar termo', 'Tente novamente.');
    }
  };

  const handleDelete = async (id: string) => {
    SweetAlert.loading();
    try {
      await deleteTerm(id);
      SweetAlert.success('Termo excluído', 'O termo foi removido com sucesso.');
      fetchTerms();
    } catch {
      SweetAlert.error('Erro ao excluir termo', 'Tente novamente.');
    }
  };  

  const fetchTerms = async () => {
    setLoading(true);
    try {
      const { data } = await getTerms();
      setTerms(data.terms);
    } catch (err) {
      SweetAlert.error('Erro ao carregar termos', 'Tente novamente mais tarde');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: CreateTermPayload) => {
    SweetAlert.loading();
    try {
      await createTerm(values);

      SweetAlert.success('Sucesso!', 'Termo criado com sucesso!');
      form.resetFields();
      fetchTerms();
    } catch {
      SweetAlert.error('Erro ao criar termo', 'Verifique os dados e tente novamente');
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  const columns = [
    {
      title: 'Título',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: 'Versão',
      dataIndex: 'version',
      key: 'version'
    },
    {
      title: 'Ativo',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) =>
        isActive ? (
          <Tag color="green">Ativo</Tag>
        ) : (
          <Tag color="red">Inativo</Tag>
        ),
    },
    {
      title: 'Data de Criação',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value: string) => new Date(value).toLocaleString('pt-BR'),
    },
    {
      title: 'Data de Atualização',
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
    <div style={{ maxWidth: '100%', padding: '20px' }}>
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        {/* Card do formulário */}
        <Card
          title="Cadastrar Novo Termo"
          style={{ flex: 1, minWidth: 300 }}
        >
          <Form form={form} onFinish={onSubmit} layout="vertical">
            <Form.Item
              label="Título"
              name="title"
              rules={[{ required: true, message: 'Por favor, insira o título.' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Conteúdo"
              name="content"
              rules={[{ required: true, message: 'Por favor, insira o conteúdo do termo.' }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item
              label="Versão"
              name="version"
              rules={[{ required: true, message: 'Por favor, insira a versão.' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Ativo"
              name="isActive"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ background: '#001529' }}>
                Salvar
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* Card da Tabela */}
        <Card
          title="Termos Cadastrados"
          style={{ flex: 2 }}
        >
          <Table
            columns={columns}
            dataSource={terms}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 5 }}
          />
        </Card>

        <EditTermModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSubmit={handleUpdateTerm}
          initialValues={selectedTerm || undefined}
        />

      </div>
    </div>
  );
}  
