export interface CommentUser{
    _id: string;
    username: string;
    avatar: string
}

export interface Comment{
    _id: string;
    content: string;
    user: CommentUser;
    post: string;
    parentComment: string | null ;
    likes:string[];
    isDeleted: boolean;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
    likesCount: number;
    isLiked: boolean;
    replies?: Comment[];
}

export interface CreateCommentPayload{
    content: string;
    post: string;
    parentComment?: string;
}

export interface ApiResponse<T>{
    success: boolean;
    message?: string;
    data: T;
}