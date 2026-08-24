import { Component } from '@angular/core';

interface FeedPost {
  author: string;
  handle: string;
  time: string;
  avatar: string;
  content: string;
  image?: string;
  likes: string;
  comments: string;
  reposts: string;
}

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  protected readonly posts: FeedPost[] = [
    {
      author: 'Alex Rivera',
      handle: '@arivera',
      time: '2h ago',
      avatar: 'https://picsum.photos/seed/alex-rivera/80/80',
      content:
        'Just finished the new branding concepts for the Q3 launch. What do you all think of the softer color palette?',
      image: 'https://picsum.photos/seed/mingle-branding/1200/700',
      likes: '245',
      comments: '42',
      reposts: '12',
    },
    {
      author: 'David Chen',
      handle: '@dchen_tech',
      time: '4h ago',
      avatar: 'https://picsum.photos/seed/david-chen/80/80',
      content:
        'Reminder: Complexity is easy, simplicity is hard. Always strive for the latter in your architecture and your UI.',
      likes: '1.2k',
      comments: '89',
      reposts: '340',
    },
  ];
}
