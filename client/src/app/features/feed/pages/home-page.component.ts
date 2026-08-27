import { Component, OnInit, signal, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PostService } from '../../post/services/post-service';
import { Post } from '../../post/models/post.model';
import { CommentComponent } from './comment/comment.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [DatePipe, CommentComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent implements OnInit {
  private readonly postService = inject(PostService);

  protected readonly posts = signal<Post[]>([]);
  protected readonly isLoading = signal(true);

  ngOnInit(): void {
    this.postService.getPosts().subscribe({
      next: (response) => {
        // Reads the array from response.data.data per PaginatedPosts interface
        this.posts.set(response.data.data ?? []);
        this.isLoading.set(false);
        console.log('Fetched posts:', this.posts());
      },
      error: (err) => {
        console.error('Failed to fetch posts:', err);
        this.isLoading.set(false);
      },
    });
  }
  // Pass the populated author object from your post model
  getAvatarUrl(author: { username?: string; avatar?: string } | null | undefined): string {
    console.log('Author object:', author); // Debugging line to check the author object
    if (author?.avatar) {
      // Prepend server base URL if storing local upload paths like '/uploads/avatar.png'
      return author.avatar.startsWith('http') 
        ? author.avatar 
        : `http://localhost:3000${author.avatar}`;
    }

    // Fallback seed using username or default string
    return `https://picsum.photos/seed/${author?.username || 'mingle'}/80/80`;
  }
}