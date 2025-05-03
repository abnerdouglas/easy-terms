import { Form, Input, Modal, Switch } from 'antd';
import { useEffect } from 'react';
import { CreateTermPayload, UpdateTermPayload } from '../../types/term';

interface EditTermModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: UpdateTermPayload) => void;
  initialValues?: CreateTermPayload;
}

export function EditTermModal({
  open,
  onClose,
  onSubmit,
  initialValues
}: EditTermModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues]);

  return (
    <Modal
      title="Editar Termo"
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Salvar"
      cancelText="Cancelar"
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          label="Título"
          name="title"
          rules={[{ required: true, message: 'Insira o título.' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Conteúdo"
          name="content"
          rules={[{ required: true, message: 'Insira o conteúdo.' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label="Versão"
          name="version"
          rules={[{ required: true, message: 'Insira a versão.' }]}
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
      </Form>
    </Modal>
  );
}
