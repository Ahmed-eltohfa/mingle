import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ApiResponse,
  CreatePostPayload,
  PaginatedPosts,
  Post,
  UpdatePostPayload
} from '../models/post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api/posts';

  createPost(payload: CreatePostPayload): Observable<ApiResponse<Post>> {
    return this.http.post<ApiResponse<Post>>(this.baseUrl, this.toFormData(payload));
  }

  getPosts(page = 1, limit = 10): Observable<ApiResponse<PaginatedPosts>> {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<ApiResponse<PaginatedPosts>>(this.baseUrl, { params });
  }

  /** Note: the server currently returns an array here (Post.find, not findById). */
  getPostById(postId: string): Observable<ApiResponse<Post[]>> {
    return this.http.get<ApiResponse<Post[]>>(`${this.baseUrl}/${postId}`);
  }

  updatePost(postId: string, payload: UpdatePostPayload): Observable<ApiResponse<Post>> {
    return this.http.patch<ApiResponse<Post>>(`${this.baseUrl}/${postId}`, this.toFormData(payload));
  }

  deletePost(postId: string): Observable<ApiResponse<Post>> {
    return this.http.delete<ApiResponse<Post>>(`${this.baseUrl}/${postId}`);
  }

  private toFormData(payload: CreatePostPayload | UpdatePostPayload): FormData {
    const formData = new FormData();

    if (payload.content !== undefined) {
      formData.append('content', payload.content);
    }
    if ('visibility' in payload && payload.visibility) {
      formData.append('visibility', payload.visibility);
    }
    if (payload.altText !== undefined) {
      formData.append('altText', payload.altText);
    }
    // Field name must match the server's multer config: upload.array("media", 5)
    (payload.files ?? []).forEach(file => formData.append('media', file));

    return formData;
  }
}