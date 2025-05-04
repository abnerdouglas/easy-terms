import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f5',
      }}
    >
      <Result
        status="403"
        title="403 - Acesso negado"
        subTitle="Você não tem permissão para acessar esta página."
        extra={
          <Button type="primary" onClick={() => navigate('/')}>
            Voltar para início
          </Button>
        }
      />
    </div>
  );
}
