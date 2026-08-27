import { Component, OnInit, signal, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PostService } from '../../post/services/post-service';
import { Post } from '../../post/models/post.model';
import { CreatePostComponent } from '../../post/pages/create-post.component';
import { CommentComponent } from './comment/comment.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [DatePipe, CreatePostComponent, CommentComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent implements OnInit {
  private readonly postService = inject(PostService);

  protected readonly posts = signal<Post[]>([]);
  protected readonly isLoading = signal(true);

  ngOnInit(): void {
    this.loadPosts();
  }

  protected loadPosts(): void {
    this.postService.getPosts().subscribe({
      next: (response) => {
        // Reads the array from response.data.data per PaginatedPosts interface
        this.posts.set(response.data.data ?? []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to fetch posts:', err);
        this.isLoading.set(false);
      },
    });
  }

  protected onPostCreated(newPost: Post): void {
    if (newPost) {
      this.posts.update((current) => [newPost, ...current]);
    }
  }

  protected getAuthorName(author: any): string {
    if (!author) return 'Anonymous';
    if (typeof author === 'object') {
      return author.name || author.username || 'Anonymous';
    }
    return String(author);
  }

  protected getAuthorUsername(author: any): string {
    if (typeof author === 'object' && author?.username) {
      return author.username;
    }
    return '';
  }

  protected getAuthorAvatar(author: any): string {
    if (typeof author === 'object' && author?.avatar) {
      const avatar = author.avatar;
      return avatar.startsWith('http') ? avatar : `http://localhost:3000${avatar}`;
    }
    const seed = typeof author === 'string' ? author : author?.username || 'user';
    return `https://picsum.photos/seed/${seed}/80/80`;
  }

  protected toggleLike(post:Post): void{
    //console.log('LIKED CLICKED', post._id);

    const request = post.isLiked
      ? this.postService.unlikePost(post._id) : this.postService.likePost(post._id)
    
      request.subscribe({
        next: (response) =>{
          this.posts.update((posts) => 
            posts.map((p) => 
              p._id === post._id
                ?{
                  ...p,
                  likeCount: response.data.likeCount,
                  isLiked: response.data.isLiked,
                }
                : p
            )
          )
        },
        error: (err) => {
          console.error('Failed to toggle Like: ', err);
          
        }
      })
  }


  protected toggleSave(post: Post): void{
    const request = post.isSaved
      ? this.postService.unsavePost(post._id)
      : this.postService.savePost(post._id)

    request.subscribe({
      next: (response) =>{
        this.posts.update((posts) =>
          posts.map((p) => 
          p._id === post._id
            ? {
              ...p,
              isSaved: !p.isSaved,
            }
            : p))
      },
      error: (err) => {
        console.error('Failed to toggle Save:', err);
        
      }
    })
  }
}
