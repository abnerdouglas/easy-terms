import { useEffect, useState } from 'react';
import { Table, Form, Input, Switch, Button, message, Card } from 'antd';
import { createTerm, getTerms } from '../../services/term/termService';

export default function TermsPage() {
  const [form] = Form.useForm();
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTerms = async () => {
    setLoading(true);
    try {
      const { data } = await getTerms();
      setTerms(data.terms);
    } catch (err) {
      message.error('Erro ao carregar termos');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    try {
      await createTerm(values);
      message.success('Termo criado com sucesso');
      form.resetFields();
      fetchTerms();
    } catch {
      message.error('Erro ao criar termo');
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  const columns = [
    { title: 'Título', dataIndex: 'title', key: 'title' },
    { title: 'Versão', dataIndex: 'version', key: 'version' },
    {
      title: 'Ativo',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (value: boolean) => (value ? 'Sim' : 'Não'),
    },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px' }}>
      <Card title="Cadastrar Novo Termo" style={{ marginBottom: 24 }}>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item label="Título" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Conteúdo" name="content" rules={[{ required: true }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item label="Versão" name="version" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Ativo" name="isActive" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Salvar</Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Termos Cadastrados">
        <Table
          columns={columns}
          dataSource={terms}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
}
