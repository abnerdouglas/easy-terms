export interface CreateUserPayload {
    name: string;
    email: string;
    password: string;
    role: 'ADMIN' | 'EMPLOYEE';
    acceptedTermIds: string[];
}

export interface LoginPayload {
    email: string;
    password: string;
}
