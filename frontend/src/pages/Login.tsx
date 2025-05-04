import { Button, Form, Input, Typography, Card } from 'antd';
import { login } from '../services/auth/authService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { SweetAlert } from '../components/SweetAlert/SweetAlert';
import { LoginPayload } from '../types/user';

const { Text, Link } = Typography;

export default function Login() {
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (values: LoginPayload) => {
    SweetAlert.loading();
    try {
      const { data } = await login(values);
      localStorage.setItem('token', data.acess_token);

      authLogin({
        access_token: data.acess_token,
        user: data.user,
      });

      SweetAlert.success('Sucesso!', 'Login realizado com sucesso!');

      if (data.user.role === 'ADMIN') {
        navigate('/terms');
      } else if (data.user.role === 'EMPLOYEE') {
        navigate('/termsAcceptance');
      } else {
        navigate('/unauthorized'); // fallback
      }

    } catch (error: any) {
      const apiError = error?.response?.data;

      const errorMessages = Array.isArray(apiError?.message)
        ? apiError.message.join('<br/>') // quebra de linha no HTML
        : apiError?.message || 'Erro ao realizar login';

      SweetAlert.error('Erro', errorMessages);
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
        <Typography.Title level={2} style={{ textAlign: 'center', marginBottom: 10, color: '#001529' }}>
          Easy Terms
        </Typography.Title>
        <Typography.Text style={{ display: 'block', textAlign: 'center', marginBottom: 24 }}>
          Sistema de Gerenciamento de Termos de Uso
        </Typography.Text>

        <Form onFinish={onSubmit} layout="vertical">
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
            <Button type="primary" htmlType="submit" size="large" block style={{ background: '#001529' }}>
              Entrar
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Text>Não possui uma conta? </Text>
            <Link onClick={() => navigate('/user/create')}>Clique aqui para criar uma nova.</Link>
          </div>

        </Form>
      </Card>
    </div>
  );
}
