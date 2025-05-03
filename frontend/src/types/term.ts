export interface CreateTermPayload {
    title: string;
    content: string;
    version: string;
    isActive: boolean;
}

export interface UpdateTermPayload {
    id: string;
    title: string;
    content: string;
    version: string;
    isActive: boolean;
}