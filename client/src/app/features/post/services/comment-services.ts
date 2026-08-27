import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Comment, CreateCommentPayload } from '../models/comment.models';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api/comments';

  getCommentsByPostId(postId: string): Observable<ApiResponse<Comment[]>> {
    return this.http.get<ApiResponse<Comment[]>>(`${this.baseUrl}/post/${postId}`);
  }

  createComment(payload: CreateCommentPayload): Observable<ApiResponse<Comment>> {
    return this.http.post<ApiResponse<Comment>>(this.baseUrl, payload);
  }

  updateComment(commentId: string, content: string): Observable<ApiResponse<Comment>> {
    return this.http.patch<ApiResponse<Comment>>(`${this.baseUrl}/${commentId}`, { content });
  }

  deleteComment(commentId: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/${commentId}`);
  }

  likeComment(commentId: string): Observable<ApiResponse<{ likesCount: number }>> {
    return this.http.post<ApiResponse<{ likesCount: number }>>(`${this.baseUrl}/${commentId}/like`, {});
  }

  unlikeComment(commentId: string): Observable<ApiResponse<{ likesCount: number }>> {
    return this.http.delete<ApiResponse<{ likesCount: number }>>(`${this.baseUrl}/${commentId}/like`);
  }

  getCommentLikes(commentId: string): Observable<ApiResponse<{ likesCount: number; users: any[] }>> {
    return this.http.get<ApiResponse<{ likesCount: number; users: any[] }>>(`${this.baseUrl}/${commentId}/likes`);
  }
}
