export interface CreateUserPayload {
    name: string;
    email: string;
    password: string;
    role: 'ADMIN' | 'EMPLOYEE';
    acceptedTermIds: string[];
}

export interface UpdateUserPayload {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'EMPLOYEE';
}

export interface LoginPayload {
    email: string;
    password: string;
}
