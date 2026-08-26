import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SideNavComponent } from '../../shared/components/side-nav/side-nav.component';
import { TopBarComponent } from '../../shared/components/top-bar/top-bar.component';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';
import { RightRailComponent } from '../../shared/components/right-rail/right-rail.component';

@Component({
  selector: 'app-social-layout',
  imports: [
    RouterOutlet,
    SideNavComponent,
    TopBarComponent,
    BottomNavComponent,
    RightRailComponent,
  ],
  templateUrl: './social-layout.component.html',
  styleUrl: './social-layout.component.css',
})
export class SocialLayoutComponent {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly railVariant = signal<'home' | 'profile'>('home');

  constructor() {
    this.updateRailVariant();

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.updateRailVariant());
  }

  private updateRailVariant(): void {
    const routeSnapshot = this.findLastSnapshot(this.activatedRoute.snapshot);
    const rail = routeSnapshot?.data['rail'];

    this.railVariant.set(rail === 'profile' ? 'profile' : 'home');
  }

  private findLastSnapshot(
    snapshot: ActivatedRouteSnapshot,
  ): ActivatedRouteSnapshot {
    let cursor = snapshot;

    while (cursor.firstChild) {
      cursor = cursor.firstChild;
    }

    return cursor;
  }
}
