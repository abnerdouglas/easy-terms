import { useEffect, useState } from 'react';
import { Table, Tabs, Card, Tag } from 'antd';
import { getUserHistoryLogs, getTermHistoryLogs } from '../../services/history/historyService';

const { TabPane } = Tabs;

export default function HistoryPage() {
    const [userLogs, setUserLogs] = useState([]);
    const [termLogs, setTermLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const [userRes, termRes] = await Promise.all([
                getUserHistoryLogs(),
                getTermHistoryLogs()
            ]);

            setUserLogs(userRes.data);
            setTermLogs(termRes.data);
        } catch {
            console.error('Erro ao carregar logs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const columns = [
        {
            title: 'Ação',
            dataIndex: 'action',
            key: 'action',
            render: (action: string) => <Tag color="blue">{action}</Tag>,
        },
        {
            title: 'Responsável',
            dataIndex: 'performedBy',
            key: 'performedBy',
            render: (name: string) => name || '-',
        },
        {
            title: 'Data',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (value: string | null) =>
                value ? new Date(value).toLocaleString('pt-BR') : '-',
        },
        {
            title: 'Dados Criados/Alterados',
            dataIndex: 'data',
            key: 'data',
            render: (data: any, record: any) => {
                if (!data) return '-';

                if (record.entity === 'User') {
                    return (
                        <div>
                            <div><strong>Nome:</strong> {data.name}</div>
                            <div><strong>Email:</strong> {data.email}</div>
                            <div><strong>Função:</strong> {data.role}</div>
                        </div>
                    );
                }

                if (record.entity === 'Term') {
                    return (
                        <div>
                            <div><strong>Título:</strong> {data.title}</div>
                            <div><strong>Versão:</strong> {data.version}</div>
                            <div><strong>Conteúdo:</strong> {data.content}</div>
                        </div>
                    );
                }

                // fallback para tipos desconhecidos
                return (
                    <pre style={{ maxWidth: 300, whiteSpace: 'pre-wrap' }}>
                        {JSON.stringify(data, null, 2)}
                    </pre>
                );
            }
        }

    ];

    return (
        <Card title="Histórico do Sistema" style={{ margin: '2rem' }}>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Usuários" key="1">
                    <Table
                        dataSource={userLogs}
                        columns={columns}
                        rowKey="id"
                        loading={loading}
                        pagination={{ pageSize: 5 }}
                    />
                </TabPane>
                <TabPane tab="Termos" key="2">
                    <Table
                        dataSource={termLogs}
                        columns={columns}
                        rowKey="id"
                        loading={loading}
                        pagination={{ pageSize: 5 }}
                    />
                </TabPane>
            </Tabs>
        </Card>
    );
}
