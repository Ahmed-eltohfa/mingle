import { Component, Input, OnInit, signal, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Comment, ApiResponse } from '../../../post/models/comment.models';
import { CommentService } from '../../../post/services/comment-services';
import { UserService } from '../../../profile/services/user.service';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css',
})
export class CommentComponent implements OnInit {
  private readonly commentService = inject(CommentService);
  private readonly userService = inject(UserService);

  @Input({ required: true }) postId!: string;

  protected readonly comments = signal<Comment[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly currentUser = this.userService.currentUser;

  // New comment input
  protected newCommentText = '';
  protected readonly isSubmitting = signal(false);

  // Reply tracking
  protected readonly activeReplyId = signal<string | null>(null);
  protected replyText = '';
  protected readonly isSubmittingReply = signal(false);

  ngOnInit(): void {
    if (!this.userService.currentUser()) {
      this.userService.getCurrentUser().subscribe({
        error: () => { },
      });
    }
    this.loadComments();
  }

  loadComments(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.commentService.getCommentsByPostId(this.postId).subscribe({
      next: (response: ApiResponse<Comment[]>) => {
        this.comments.set(response.data ?? []);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to load Comments:', err);
        this.errorMessage.set(err.error?.message || 'Failed to load Comments.');
        this.isLoading.set(false);
      },
    });
  }

  submitComment(): void {
    const content = this.newCommentText.trim();
    if (!content || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.commentService
      .createComment({ post: this.postId, content })
      .subscribe({
        next: (res) => {
          this.newCommentText = '';
          this.isSubmitting.set(false);
          if (res.data) {
            const newComment: Comment = {
              ...res.data,
              user: res.data.user || this.userService.currentUser() || { _id: '', username: 'You', avatar: '' },
              likesCount: res.data.likesCount ?? 0,
              isLiked: false,
              replies: [],
            };
            this.comments.update((prev) => [newComment, ...prev]);
          } else {
            this.loadComments();
          }
        },
        error: (err: HttpErrorResponse) => {
          console.error('Failed to post comment:', err);
          this.isSubmitting.set(false);
        },
      });
  }

  toggleReply(commentId: string): void {
    if (this.activeReplyId() === commentId) {
      this.activeReplyId.set(null);
      this.replyText = '';
    } else {
      this.activeReplyId.set(commentId);
      this.replyText = '';
    }
  }

  submitReply(parentCommentId: string): void {
    const content = this.replyText.trim();
    if (!content || this.isSubmittingReply()) return;

    this.isSubmittingReply.set(true);
    this.commentService
      .createComment({ post: this.postId, parentComment: parentCommentId, content })
      .subscribe({
        next: (res) => {
          this.replyText = '';
          this.activeReplyId.set(null);
          this.isSubmittingReply.set(false);
          if (res.data) {
            const newReply: Comment = {
              ...res.data,
              user: res.data.user || this.userService.currentUser() || { _id: '', username: 'You', avatar: '' },
              likesCount: res.data.likesCount ?? 0,
              isLiked: false,
            };
            this.comments.update((prev) =>
              prev.map((c) =>
                c._id === parentCommentId
                  ? { ...c, replies: [...(c.replies ?? []), newReply] }
                  : c
              )
            );
          } else {
            this.loadComments();
          }
        },
        error: (err: HttpErrorResponse) => {
          console.error('Failed to post reply:', err);
          this.isSubmittingReply.set(false);
        },
      });
  }

  toggleLike(comment: Comment): void {
    const isLiked = comment.isLiked;
    const request$ = isLiked
      ? this.commentService.unlikeComment(comment._id)
      : this.commentService.likeComment(comment._id);

    request$.subscribe({
      next: (res) => {
        const newCount =
          res.data?.likesCount ??
          (isLiked ? Math.max(0, comment.likesCount - 1) : comment.likesCount + 1);
        this.updateCommentInState(comment._id, !isLiked, newCount);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to toggle like:', err);
      },
    });
  }

  private updateCommentInState(commentId: string, isLiked: boolean, likesCount: number): void {
    this.comments.update((comments) =>
      comments.map((c) => {
        if (c._id === commentId) {
          return { ...c, isLiked, likesCount };
        }
        if (c.replies?.some((r) => r._id === commentId)) {
          return {
            ...c,
            replies: c.replies.map((r) =>
              r._id === commentId ? { ...r, isLiked, likesCount } : r
            ),
          };
        }
        return c;
      })
    );
  }

  getAuthorName(user: any): string {
    if (!user) return 'Anonymous';
    if (typeof user === 'object') {
      return user.name || user.username || 'Anonymous';
    }
    return String(user);
  }

  getAuthorAvatar(user: any): string {
    if (typeof user === 'object' && user?.avatar) {
      const avatar = user.avatar;
      return avatar.startsWith('http') ? avatar : `http://localhost:3000${avatar}`;
    }
    const seed = typeof user === 'string' ? user : user?.username || 'user';
    return `https://picsum.photos/seed/${seed}/50/50`;
  }
}

