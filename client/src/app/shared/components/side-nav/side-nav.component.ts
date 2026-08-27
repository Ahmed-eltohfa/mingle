import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthApiService } from '../../../features/auth/services/auth-api.service';
import { UserService } from '../../../features/profile/services/user.service';
import { NavItem } from '../../models/nav-item';

@Component({
  selector: 'app-side-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css',
})
export class SideNavComponent {
  private readonly authApi = inject(AuthApiService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  protected readonly navItems: NavItem[] = [
    { label: 'Home', icon: 'home', route: '/home', exact: true },
    { label: 'Explore', icon: 'explore', route: '/explore', exact: true },
    { label: 'Create', icon: 'add_box', route: '/create', exact: true },
    {
      label: 'Notifications',
      icon: 'notifications',
      route: '/notifications',
      exact: true,
    },
    { label: 'Messages', icon: 'mail', route: '/messages', exact: true },
    { label: 'Profile', icon: 'person', route: '/profile', exact: true },
    { label: 'Saved', icon: 'bookmark', route: '/saved', exact: true },
    { label: 'Settings', icon: 'settings', route: '/settings', exact: true },
  ];

  handleLogout(): void {
    this.authApi.logout();
    this.userService.clearCurrentUser();
    this.router.navigate(['/login']);
  }
}
