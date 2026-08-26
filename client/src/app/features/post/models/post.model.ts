export type MediaType = 'image' | 'video';
export type PostVisibility = 'public' | 'followers' | 'private';

export interface PostMedia {
  url: string;
  type: MediaType;
  altText: string;
}

export interface Post {
  _id: string;
  author: string;
  content: string;
  media: PostMedia[];
  visibility: PostVisibility;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Matches the shape returned by your successResponse()/errorResponse() helpers. */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedPosts {
  docs: never[];
  data: Post[];
  page: number;
  limit: number;
  count: number;
}

export interface CreatePostPayload {
  content: string;
  visibility: PostVisibility;
  altText?: string;
  files?: File[];
}

export interface UpdatePostPayload {
  content?: string;
  visibility?: PostVisibility;
  altText?: string;
  files?: File[];
}