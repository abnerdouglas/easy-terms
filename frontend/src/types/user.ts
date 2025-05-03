export interface CreateUserPayload {
    name: string;
    email: string;
    password: string;
    role: 'ADMIN' | 'EMPLOYEE';
    acceptedTermIds: string[];
}