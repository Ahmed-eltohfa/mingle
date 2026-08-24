import { Component } from '@angular/core';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css',
})
export class ProfilePageComponent {
  protected readonly gallery = [
    'https://picsum.photos/seed/mingle-gallery-1/500/500',
    'https://picsum.photos/seed/mingle-gallery-2/500/500',
    'https://picsum.photos/seed/mingle-gallery-3/500/500',
    'https://picsum.photos/seed/mingle-gallery-4/500/500',
    'https://picsum.photos/seed/mingle-gallery-5/500/500',
    'https://picsum.photos/seed/mingle-gallery-6/500/500',
  ];
}
