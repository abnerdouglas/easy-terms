import { Layout, Menu } from 'antd';
import {
  FileTextOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const { Sider, Content, Header } = Layout;

export default function NavbarLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      logout();
    } else {
      navigate(key);
    }
  };

  const items = [
    { key: '/terms', icon: <FileTextOutlined />, label: 'Termos' },
    { key: '/users', icon: <UserOutlined />, label: 'Usuários' },
    { key: '/termsAcceptance', icon: <FileTextOutlined />, label: 'Termos Aceitos' },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Sair' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} width={200} theme="dark">
        <div style={{ color: '#fff', padding: '16px', textAlign: 'center', fontWeight: 'bold' }}>
          {'Easy Terms'}
        </div>
        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[location.pathname]}
          onClick={handleClick}
          items={items}
        />
      </Sider>

      <Layout>
        <Header style={{ background: '#fff', padding: '0 16px', textAlign: 'right' }}>
          <span
            style={{ fontSize: 20, cursor: 'pointer' }}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </span>
        </Header>

        <Content style={{ padding: '24px' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
