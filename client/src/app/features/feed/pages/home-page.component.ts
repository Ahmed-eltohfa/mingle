import { Component, OnInit, signal, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PostService } from '../../post/services/post-service'; // Adjust relative path
import { Post } from '../../post/models/post.model'; // Adjust relative path

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [DatePipe],
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
}