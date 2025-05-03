import { useEffect, useState } from 'react';
import { Form, Input, Select, Button, Card, Checkbox, Typography, Col, Row } from 'antd';
import { createUser } from '../../services/user/userService';
import { getTerms } from '../../services/term/termService';
import { CreateUserPayload } from '../../types/user';
import { SweetAlert } from '../../components/SweetAlert/SweetAlert';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;
const { Text, Link } = Typography;

export default function CreateUserPage() {
    const [form] = Form.useForm();
    const [terms, setTerms] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchTerms = async () => {
        setLoading(true);
        try {
            const { data } = await getTerms();
            setTerms(data.terms);
        } catch {
            SweetAlert.error('Erro', 'Erro ao carregar termos de consentimento');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (values: CreateUserPayload) => {
        SweetAlert.loading();
        try {
            await createUser(values);

            if (values.acceptedTermIds.length > 0) {
                await SweetAlert.warning('Atenção', 'Os Termos de consentimento devem ser lidos e aceitos pelo usuário via email. Caso contrário, o usuário não poderá acessar o sistema!');
            }

            await SweetAlert.success('Sucesso', 'Usuário criado com sucesso!');

            form.resetFields();

        } catch (error: any) {

            const apiError = error?.response?.data;

            const errorMessages = Array.isArray(apiError?.message)
                ? apiError.message.join('<br/>') // quebra de linha no HTML
                : apiError?.message || 'Erro ao criar usuário';

            SweetAlert.error('Erro', errorMessages);

        }
    };

    useEffect(() => {
        fetchTerms();
    }, []);

    return (
        <div
            style={{
                background: 'linear-gradient(to right, #e0eafc, #cfdef3)',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <Card
                title="Cadastrar Novo Usuário"
                style={{
                    width: 700,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    borderRadius: 12,
                    border: '1px solid #d0d0d0',
                    background: '#ffffffee',
                }}>
                <Form form={form} onFinish={onSubmit} layout="vertical">

                    <Row gutter={16}>
                        <Col xs={24} sm={24} md={12}>
                            <Form.Item
                                label="Nome"
                                name="name"
                                rules={[{ required: true, message: 'Por favor, insira o nome.' }]}
                            >
                                <Input placeholder="Digite um nome de usuário" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={12}>
                            <Form.Item
                                label="E-mail"
                                name="email"
                                rules={[
                                    { required: true, message: 'Por favor, insira o e-mail.' },
                                    { type: 'email', message: 'Formato de e-mail inválido.' }
                                ]}
                            >
                                <Input placeholder="Digite um e-mail para o usuário" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={12}>
                            <Form.Item
                                label="Senha"
                                name="password"
                                rules={[{ required: true, message: 'Por favor, insira a senha.' }]}
                            >
                                <Input.Password placeholder="Crie uma senha para o usuário" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={12}>
                            <Form.Item
                                label="Função"
                                name="role"
                                rules={[{ required: true, message: 'Por favor, selecione uma função.' }]}
                            >
                                <Select placeholder="Selecione uma função">
                                    <Option value="ADMIN">Administrador</Option>
                                    <Option value="EMPLOYEE">Funcionário</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Termos de consentimento"
                        name="acceptedTermIds"
                        initialValue={[]}
                    >
                        <Checkbox.Group
                            style={{
                                display: 'flex',
                          
                                maxHeight: 200,
                                overflowY: 'auto',
                                paddingRight: 8
                            }}
                        >
                            {terms.map((term: any) => (
                                <Checkbox key={term.id} value={term.id} style={{ marginBottom: 12 }}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <strong>{term.title} (v{term.version})</strong>
                                        <span style={{ fontSize: 12, color: '#555' }}>{term.content}</span>
                                    </div>
                                </Checkbox>
                            ))}
                        </Checkbox.Group>
                    </Form.Item>

                    <Form.Item>
                        <Button htmlType="submit" type="primary" style={{ background: '#001529' }}>
                            Salvar
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: 'center', marginTop: 24 }}>
                        <Text>Já possui uma conta? </Text>
                        <Link onClick={() => navigate('/login')}>Clique aqui para fazer login</Link>
                    </div>

                </Form>
            </Card>
        </div>
    );
}
