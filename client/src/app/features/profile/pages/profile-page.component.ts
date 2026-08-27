import { Component, OnInit, signal, inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-profile-page',
  standalone: true,
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css',
  imports: [RouterLink], 
})
export class ProfilePageComponent implements OnInit {
  private readonly userService = inject(UserService);

  protected readonly user = signal<User | null>(null);
  protected readonly isLoading = signal(true);

  protected readonly gallery = [
    'https://picsum.photos/seed/mingle-gallery-1/500/500',
    'https://picsum.photos/seed/mingle-gallery-2/500/500',
    'https://picsum.photos/seed/mingle-gallery-3/500/500',
    'https://picsum.photos/seed/mingle-gallery-4/500/500',
    'https://picsum.photos/seed/mingle-gallery-5/500/500',
    'https://picsum.photos/seed/mingle-gallery-6/500/500',
  ];

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (res) => {
        this.user.set(res.user);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to fetch user profile:', err);
        this.isLoading.set(false);
      },
    });
  }

  // Fallback avatar if user.avatar is empty string
  getAvatarUrl(user: User): string {
    if (user.avatar) {
      return user.avatar.startsWith('http') ? user.avatar : `http://localhost:3000${user.avatar}`;
    }
    return `https://picsum.photos/seed/${user.username}/220/220`;
  }
}