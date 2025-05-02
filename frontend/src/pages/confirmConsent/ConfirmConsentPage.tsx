import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button, Card, Result, Spin } from 'antd';
import api from '../../services/axios';

export default function ConfirmConsentPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  const userId = searchParams.get('userId');
  const termId = searchParams.get('termId');

  useEffect(() => {
    const confirm = async () => {
      if (!userId || !termId) {
        setStatus('error');
        return;
      }

      try {
        await api.post('/terms/consent/confirm', { userId, termId });
        setStatus('success');
      } catch (err) {
        console.error(err);
        setStatus('error');
      }
    };

    confirm();
  }, [userId, termId]);

  if (status === 'loading') return <Spin fullscreen />;

  return (
    <Card style={{ maxWidth: 600, margin: '100px auto' }}>
      <Result
        status={status}
        title={
          status === 'success'
            ? 'Consentimento confirmado com sucesso!'
            : 'Ocorreu um erro ao confirmar o consentimento.'
        }
        extra={
          <Button type="primary" href="/">
            Voltar para o início
          </Button>
        }
      />
    </Card>
  );
}
