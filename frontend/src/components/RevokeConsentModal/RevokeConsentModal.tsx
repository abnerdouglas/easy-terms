import { Modal, Typography } from 'antd';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  termTitle: string;
}

export function RevokeConsentModal({ open, onClose, onConfirm, userName, termTitle }: Props) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={onConfirm}
      okText="Revogar"
      cancelText="Cancelar"
      title="Revogar consentimento"
    >
      <Typography.Paragraph>
        Tem certeza que deseja revogar o consentimento de <strong>{userName}</strong> para o termo <strong>{termTitle}</strong>?
      </Typography.Paragraph>
    </Modal>
  );
}
