import { Button, Form, Input, Typography, Card, message } from 'antd';
import { login } from '../services/auth/authService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      const { data } = await login(values);
      localStorage.setItem('token', data.acess_token);
      authLogin?.();
      message.success('Login realizado com sucesso');
      navigate('/terms');
    } catch (error) {
      message.error('Erro ao realizar login. Verifique suas credenciais.');
    }
  };

  return (
    <div
      style={{
        background: 'linear-gradient(to right, #e0eafc, #cfdef3)',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card
        style={{
          width: 400,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          borderRadius: 12,
          border: '1px solid #d0d0d0',
          background: '#ffffffee',
        }}
      >
        <Typography.Title level={2} style={{ textAlign: 'center', marginBottom: 10, color: '#1890ff' }}>
          Easy Terms
        </Typography.Title>
        <Typography.Text style={{ display: 'block', textAlign: 'center', marginBottom: 24 }}>
          Sistema de Gerenciamento de Termos de Uso e Políticas de Privacidade
        </Typography.Text>

        <Form onFinish={onFinish} layout="vertical">
          <Form.Item
            label="E-mail"
            name="email"
            rules={[{ required: true, type: 'email', message: 'Informe um e-mail válido' }]}
          >
            <Input size="large" placeholder="email@empresa.com" />
          </Form.Item>

          <Form.Item
            label="Senha"
            name="password"
            rules={[{ required: true, message: 'Digite sua senha' }]}
          >
            <Input.Password size="large" placeholder="••••••••" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              Entrar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
