import { Injectable , inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import{
    ApiResponse,
    Comment,
    CreateCommentPayload
} from "../models/comment.models"

@Injectable({providedIn: 'root'})

export class CommentService{
    private readonly http = inject(HttpClient)
    private readonly baseurl = 'http://localhost:3000/api/comments'

    getCommentsByPostId(postId: string): Observable<ApiResponse<Comment[]>>{
        return this.http.get<ApiResponse<Comment[]>>(
            `${this.baseurl}/post/${postId}`
        )
    }

    
    createComment(payload: CreateCommentPayload):Observable<ApiResponse<Comment>>{
        return this.http.post<ApiResponse<Comment>>(this.baseurl, payload)
    }


    updateComment(commentId: string, content: string): Observable<ApiResponse<Comment>>{
        return this.http.patch<ApiResponse<Comment>>(
            `${this.baseurl}/${commentId}`,
            {content}
        )
    }


    deleteComment(commentId: string): Observable<ApiResponse<Comment>>{
        return this.http.delete<ApiResponse<Comment>>(`${this.baseurl}/${commentId}`)
    }


    likeComment(commentId: string): Observable<ApiResponse<Comment>>{
        return this.http.post<ApiResponse<Comment>>(`${this.baseurl}/${commentId}/like`, {})
    }


    unlikeComment(commentId: string): Observable<ApiResponse<Comment>>{
        return this.http.delete<ApiResponse<Comment>>(`${this.baseurl}/${commentId}/like`)
    }


    getCommentLikes(commentId: string): Observable<ApiResponse<string[]>>{
        return this.http.get<ApiResponse<string[]>>(`${this.baseurl}/${commentId}/likes`)
    }

}