import { Modal, Form, Input } from 'antd';
import { useEffect } from 'react';
import { UpdateUserPayload } from '../../types/user';

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: UpdateUserPayload) => void;
  initialValues?: UpdateUserPayload;
}

export function EditUserModal({ open, onClose, onSubmit, initialValues }: EditUserModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues]);

  return (
    <Modal
      title="Editar Usuário"
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Salvar"
      cancelText="Cancelar"
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item name="name" label="Nome" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="E-mail" rules={[{ required: true, type: 'email' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="role" label="Função" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
