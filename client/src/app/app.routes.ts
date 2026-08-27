import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Login | Mingle',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/pages/login-page.component').then((m) => m.LoginPageComponent),
  },
  {
    path: 'signup',
    title: 'Sign Up | Mingle',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/pages/signup-page.component').then((m) => m.SignupPageComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./core/layout/social-layout.component').then((m) => m.SocialLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      {
        path: 'home',
        title: 'Home | Mingle',
        data: { rail: 'home' },
        loadComponent: () =>
          import('./features/feed/pages/home-page.component').then((m) => m.HomePageComponent),
      },
      {
        path: 'profile',
        title: 'Profile | Mingle',
        data: { rail: 'profile' },
        loadComponent: () =>
          import('./features/profile/pages/profile-page.component').then(
            (m) => m.ProfilePageComponent,
          ),
      },
      {
        path: 'edit-profile',
        title: 'Edit Profile | Mingle',
        data: { rail: 'profile' },
        loadComponent: () =>
          import('./features/profile/pages/edit-profile.component').then(
            (m) => m.EditProfileComponent,
          ),
      },
      {
        path: 'explore',
        title: 'Explore | Mingle',
        data: {
          title: 'Explore',
          description: 'Discover people, posts, and conversations tailored to your interests.',
          rail: 'home',
        },
        loadComponent: () =>
          import('./features/explore/explore-page.component').then((m) => m.ExplorePageComponent),
      },
      {
        path: 'create',
        title: 'Create | Mingle',
        data: {
          title: 'Create Post',
          description: 'Write and publish updates, media, and ideas from this workspace.',
          rail: 'home',
        },
        loadComponent: () =>
          import('./features/post/pages/create-post.component').then((m) => m.CreatePostComponent),
      },
      {
        path: 'notifications',
        title: 'Notifications | Mingle',
        data: {
          title: 'Notifications',
          description: 'Track mentions, replies, follows, and post activity in one place.',
          rail: 'profile',
        },
        loadComponent: () =>
          import('./features/static/pages/coming-soon-page.component').then(
            (m) => m.ComingSoonPageComponent,
          ),
      },
      {
        path: 'messages',
        title: 'Messages | Mingle',
        data: {
          title: 'Messages',
          description: 'Read and respond to your conversations with the people you follow.',
          rail: 'profile',
        },
        loadComponent: () =>
          import('./features/static/pages/coming-soon-page.component').then(
            (m) => m.ComingSoonPageComponent,
          ),
      },
      {
        path: 'saved',
        title: 'Saved | Mingle',
        data: {
          title: 'Saved',
          description: 'Keep important posts and references for quick access later.',
          rail: 'profile',
        },
        loadComponent: () =>
          import('./features/feed/pages/saved-posts/saved-posts').then(
            (m) => m.SavedPosts,
          ),
      },
      {
        path: 'settings',
        title: 'Settings | Mingle',
        data: {
          title: 'Settings',
          description: 'Manage your account preferences, privacy, and notification options.',
          rail: 'profile',
        },
        loadComponent: () =>
          import('./features/static/pages/coming-soon-page.component').then(
            (m) => m.ComingSoonPageComponent,
          ),
      },
    ],
  },
  { path: '**', redirectTo: 'home' },
];
