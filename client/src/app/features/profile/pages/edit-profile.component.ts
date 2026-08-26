import { Component, OnInit, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  protected readonly isSubmitting = signal(false);
  protected readonly avatarPreview = signal<string | null>(null);
  private selectedAvatarFile: File | null = null;

  protected readonly profileForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    bio: new FormControl('', { nonNullable: true })
  });

  ngOnInit(): void {
    // Populate form with current user data on load
    this.userService.getCurrentUser().subscribe({
      next: (res) => {
        this.profileForm.patchValue({
          name: res.user.name,
          bio: res.user.bio
        });
        if (res.user.avatar) {
          const url = res.user.avatar.startsWith('http') ? res.user.avatar : `http://localhost:3000${res.user.avatar}`;
          this.avatarPreview.set(url);
        }
      },
      error: (err) => console.error('Failed to load user info:', err)
    });
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedAvatarFile = file;

      const reader = new FileReader();
      reader.onload = () => this.avatarPreview.set(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  protected onSubmit(): void {
  const currentUserId = this.userService.currentUser()?._id;
  if (!currentUserId || this.profileForm.invalid) return;

  const formData = new FormData();
  formData.append('name', this.profileForm.controls.name.value);
  formData.append('username', this.profileForm.controls.name.value);
  formData.append('bio', this.profileForm.controls.bio.value);
  if (this.selectedAvatarFile) {
    formData.append('avatar', this.selectedAvatarFile);
  }

  this.userService.updateProfile(currentUserId, formData).subscribe({
    next: () => void this.router.navigateByUrl('/profile'),
    error: (err) => console.error('Failed to update profile:', err)
  });
}
}