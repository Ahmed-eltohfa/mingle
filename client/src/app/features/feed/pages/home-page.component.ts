import { Component, ElementRef, OnDestroy, OnInit, ViewChild, signal, inject } from '@angular/core';
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
export class HomePageComponent implements OnDestroy, OnInit {
  private readonly postService = inject(PostService);
  private readonly pageSize = 10;
  private intersectionObserver?: IntersectionObserver;

  @ViewChild('loadMore')
  private set loadMoreTrigger(trigger: ElementRef<HTMLElement> | undefined) {
    if (typeof IntersectionObserver === 'undefined' || !trigger) {
      return;
    }

    this.intersectionObserver?.disconnect();
    this.intersectionObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        this.loadPosts();
      }
    }, { rootMargin: '320px 0px' });
    this.intersectionObserver.observe(trigger.nativeElement);
  }

  protected readonly posts = signal<Post[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly isLoadingMore = signal(false);
  protected readonly hasMore = signal(true);

  private currentPage = 0;

  ngOnInit(): void {
    this.loadPosts();
  }

  ngOnDestroy(): void {
    this.intersectionObserver?.disconnect();
  }

  protected loadPosts(): void {
    if (this.isLoading() || this.isLoadingMore() || !this.hasMore()) {
      return;
    }

    const page = this.currentPage + 1;
    if (page === 1) {
      this.isLoading.set(true);
    } else {
      this.isLoadingMore.set(true);
    }

    this.postService.getPosts(page, this.pageSize).subscribe({
      next: (response) => {
        const nextPosts = response.data.data ?? [];
        this.posts.update((current) => {
          const existingIds = new Set(current.map((post) => post._id));
          return [...current, ...nextPosts.filter((post) => !existingIds.has(post._id))];
        });
        this.currentPage = page;
        this.hasMore.set(nextPosts.length === this.pageSize);
        this.isLoading.set(false);
        this.isLoadingMore.set(false);
      },
      error: (err) => {
        console.error('Failed to fetch posts:', err);
        this.isLoading.set(false);
        this.isLoadingMore.set(false);
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
