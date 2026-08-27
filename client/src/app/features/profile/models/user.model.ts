export interface User {
    _id: string;
    name: string;
    username: string;
    email: string;
    role: string;
    bio: string;
    avatar: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface UserResponse {
    user: User;
}