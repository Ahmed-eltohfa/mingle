import { Component, input } from '@angular/core';

@Component({
  selector: 'app-right-rail',
  templateUrl: './right-rail.component.html',
  styleUrl: './right-rail.component.css',
})
export class RightRailComponent {
  readonly variant = input<'home' | 'profile'>('home');

  protected readonly trending = [
    { category: 'Technology', topic: '#DesignSystems', posts: '12.5K posts' },
    { category: 'Business', topic: '#Q3Earnings', posts: '8,201 posts' },
    { category: 'Productivity', topic: 'Deep Work', posts: '5,432 posts' },
  ];

  protected readonly suggestions = [
    {
      name: 'Sam Taylor',
      handle: '@samt_dev',
      subtitle: 'Product engineer',
      avatar: 'https://picsum.photos/seed/sam-taylor/100/100',
    },
    {
      name: 'Tech News Daily',
      handle: '@tech_update',
      subtitle: 'New to Mingle',
      avatar: 'https://picsum.photos/seed/tech-daily/100/100',
    },
    {
      name: 'Design Hub',
      handle: '@designhub',
      subtitle: 'Suggested for you',
      avatar: 'https://picsum.photos/seed/design-hub/100/100',
    },
  ];
}
