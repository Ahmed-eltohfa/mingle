import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavItem } from '../../models/nav-item';
import { Router } from '@angular/router';
import { AuthApiService } from '../../../features/auth/services/auth-api.service';

@Component({

  selector: 'app-side-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css',

})

export class SideNavComponent {
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

  constructor(
    private router: Router,
    private authApi: AuthApiService
  ) {}

  logout() {
    this.authApi.logout();
    this.router.navigate(['/login']);
  }

}