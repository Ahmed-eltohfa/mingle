import { Component, Input, OnInit, signal, inject } from "@angular/core";
import { DatePipe } from "@angular/common";
import { Comment, ApiResponse } from "../../../post/models/comment.models";
import { CommentService } from "../../../post/services/comment-services";
import { HttpErrorResponse } from "@angular/common/http";
// import { ApiResponse } from "../../../post/models/post.model";

@Component({
    selector: 'app-comment',
    standalone: true,
    imports: [DatePipe],
    templateUrl: './comment.component.html',
    styleUrl: './comment.component.css'
})

export class CommentComponent implements OnInit{
    private readonly commentService = inject(CommentService)

    @Input({ required: true }) postId!: string

    protected readonly comments = signal<Comment[]>([])
    protected readonly isLoading = signal(false)
    protected readonly errorMessage = signal<string | null>(null)

    ngOnInit(): void {
        this.loadComments();
    }

    private loadComments(): void{
        this.isLoading.set(true)
        this.errorMessage.set(null)
       
        this.commentService.getCommentsByPostId(this.postId).subscribe({
            next: (response: ApiResponse<Comment[]>)=>{
                this.comments.set(response.data ?? [])
                this.isLoading.set(false)
            },

            error: (err: HttpErrorResponse)=>{
                console.error('Failed to load Comments:', err)
                console.error('Status:', err.status)
                console.error('Error Body:', err.error)
                this.errorMessage.set(err.error?.message || 'Failed to load Comments.')
                this.isLoading.set(false)
            }
        })
    }

}