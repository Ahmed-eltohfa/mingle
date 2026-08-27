import { Component, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostService } from '../post/services/post-service';
import { Post } from '../post/models/post.model';

@Component({
  selector: 'app-explore-page',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './explore-page.component.html',
  styleUrls: ['./explore-page.component.css'],
})
export class ExplorePageComponent {
  private readonly postService = inject(PostService);

  searchQuery: string = '';
  readonly posts = signal<Post[]>([]);
  readonly isLoading = signal(false);
  readonly hasSearched = signal(false);

  onSearch(): void {
    const query = this.searchQuery.trim();
    if (!query) {
      return;
    }

    this.hasSearched.set(true);
    this.isLoading.set(true);

    this.postService.searchPosts(query).subscribe({
      next: (res) => {
        this.posts.set(res.data?.data ?? []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Search failed:', err);
        this.posts.set([]);
        this.isLoading.set(false);
      },
    });
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.hasSearched.set(false);
    this.posts.set([]);
  }

  getAuthorName(author: any): string {
    if (!author) return 'Anonymous';
    if (typeof author === 'object') {
      return author.name || author.username || 'Anonymous';
    }
    return String(author);
  }

  getAuthorAvatar(author: any): string {
    if (typeof author === 'object' && author?.avatar) {
      const avatar = author.avatar;
      return avatar.startsWith('http') ? avatar : `http://localhost:3000${avatar}`;
    }
    const seed = typeof author === 'string' ? author : author?.username || 'user';
    return `https://picsum.photos/seed/${seed}/80/80`;
  }
}

