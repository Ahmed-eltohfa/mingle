import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthApiService } from '../../../features/auth/services/auth-api.service';
import { UserService } from '../../../features/profile/services/user.service';

@Component({
  selector: 'app-top-bar',
  imports: [RouterLink],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css',
})
export class TopBarComponent {
  private readonly authApi = inject(AuthApiService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  handleLogout(): void {
    this.authApi.logout();
    this.userService.clearCurrentUser();
    this.router.navigate(['/login']);
  }
}
