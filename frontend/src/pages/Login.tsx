import { Button, Form, Input, Typography, Card, message } from 'antd';
import { login } from '../services/auth/authService';
import { useAuth } from '../context/AuthContext'; // se estiver usando contexto para login
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login: authLogin } = useAuth(); // ativa contexto se aplicável
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      const { data } = await login(values);
      localStorage.setItem('token', data.acess_token);
      authLogin?.(); // ativa login no contexto se necessário
      message.success('Login realizado com sucesso');

      navigate('/terms');
    } catch (error) {
      message.error('Erro ao realizar login. Verifique suas credenciais.');
    }
  };

  return (
    <Card style={{ maxWidth: 400, margin: '100px auto' }}>
      <Typography.Title level={3}>Login</Typography.Title>
      <Form onFinish={onFinish} layout="vertical">
        <Form.Item label="E-mail" name="email" rules={[{ required: true, type: 'email' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Senha" name="password" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Entrar
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
