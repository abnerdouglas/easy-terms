import { Table, Card, Typography, Tag, Button } from 'antd';
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
            setLogs(response.data);
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
            title: 'Usuário',
            dataIndex: ['user', 'name'],
            key: 'userName',
        },
        {
            title: 'E-mail',
            dataIndex: ['user', 'email'],
            key: 'userEmail',
        },
        {
            title: 'Termo',
            dataIndex: ['term', 'title'],
            key: 'termTitle',
        },
        {
            title: 'Versão',
            dataIndex: ['term', 'version'],
            key: 'termVersion',
        },
        {
            title: 'Status',
            dataIndex: 'acceptedAt',
            key: 'status',
            render: (value: string | null) =>
                value ? <Tag color="green">Confirmado</Tag> : <Tag color="orange">Pendente</Tag>,
        },
        {
            title: 'Data de aceitação',
            dataIndex: 'acceptedAt',
            key: 'acceptedAt',
            render: (value: string | null) =>
                value ? new Date(value).toLocaleString('pt-BR') : '-',
        },
    ];

    return (
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: 24 }}>
            <Card>
                <Title level={3}>Histórico de Termos Aceitos</Title>
                <Table
                    columns={columns}
                    dataSource={logs}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 6 }}
                />

                <Button onClick={fetchLogs} type="primary">
                    Atualizar Histórico
                </Button>
            </Card>


        </div>
    );
}
