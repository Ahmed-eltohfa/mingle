import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavItem } from '../../models/nav-item';

@Component({
  selector: 'app-bottom-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.css',
})
export class BottomNavComponent {
  protected readonly items: NavItem[] = [
    { label: 'Home', icon: 'home', route: '/home', exact: true },
    { label: 'Explore', icon: 'search', route: '/explore', exact: true },
    { label: 'Create', icon: 'add_circle', route: '/create', exact: true },
    {
      label: 'Notifications',
      icon: 'notifications',
      route: '/notifications',
      exact: true,
    },
    { label: 'Profile', icon: 'person', route: '/profile', exact: true },
  ];
}
