import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-coming-soon-page',
  imports: [RouterLink],
  templateUrl: './coming-soon-page.component.html',
  styleUrl: './coming-soon-page.component.css',
})
export class ComingSoonPageComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly title =
    this.route.snapshot.data['title']?.toString() ?? 'Coming Soon';

  protected readonly description =
    this.route.snapshot.data['description']?.toString() ??
    'This area is ready for your backend integration.';
}
