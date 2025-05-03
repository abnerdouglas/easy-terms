import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button, Card, Result, Spin } from 'antd';
import { confirmConsent } from '../../services/termsAcceptance/termsAcceptanceService';

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
        await confirmConsent(userId, termId);
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
    <div
      style={{
        height: '100vh',
        background: '#f5f5f5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 500,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          borderRadius: 12,
        }}
      >

        <Result
          status={status}
          title={
            status === 'success'
              ? 'Consentimento confirmado com sucesso!'
              : 'Ocorreu um erro ao confirmar o consentimento.'
          }
          subTitle={'A partir de agora, você está de acordo com os termos. A qualquer momento, você pode revogar seu consentimento.'}
          extra={
            <Button type="primary" href="/login" style={{ background: '#001529' }}>
              Voltar para o login
            </Button>
          }
        />
      </Card>
    </div>
  );
}
