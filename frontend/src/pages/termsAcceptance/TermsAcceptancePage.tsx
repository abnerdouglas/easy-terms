import { Table, Card, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { getTermsAcceptanced } from '../../services/termsAcceptance/termsAcceptanceService';

const { Title } = Typography;

export default function TermsAcceptancePage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const response = await getTermsAcceptanced();
            setLogs(response.data); // ajuste se a API retornar { data: [...] }
        } catch {
            console.error('Erro ao buscar histórico de termos aceitos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const columns = [
        {
            title: 'Data de aceitação',
            dataIndex: 'acceptedAt',
            key: 'acceptedAt',
            render: (value: string) => new Date(value).toLocaleString('pt-BR'),
        },
        {
            title: 'Nome Usuário',
            dataIndex: '',
            key: '',
        },
        {
            title: 'Termo Aceito',
            dataIndex: '',
            key: '',
        },
    ];

    return (
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
            <Card>
                <Title level={3}>Histórico de Termos Aceitos</Title>
                <Table
                    columns={columns}
                    dataSource={logs}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 6 }}
                />
            </Card>
        </div>
    );
}
