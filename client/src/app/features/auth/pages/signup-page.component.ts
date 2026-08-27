import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthApiService } from '../services/auth-api.service';

@Component({
  selector: 'app-signup-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup-page.component.html',
  styleUrl: './signup-page.component.css',
})
export class SignupPageComponent {
  protected readonly isPasswordVisible = signal(false);
  protected readonly isSubmitting = signal(false);
  protected readonly formError = signal('');

  protected readonly signupForm = new FormGroup({
    fullName: new FormControl('', {
      validators: [Validators.required, Validators.minLength(2)],
      nonNullable: true,
    }),
    username: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3)],
      nonNullable: true,
    }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)],
      nonNullable: true,
    }),
    confirmPassword: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)],
      nonNullable: true,
    }),
    acceptTerms: new FormControl(false, {
      validators: [Validators.requiredTrue],
      nonNullable: true,
    }),
  });

  constructor(
    private readonly authApi: AuthApiService,
    private readonly router: Router,
  ) {}

  protected togglePasswordVisibility(): void {
    this.isPasswordVisible.update((visible) => !visible);
  }

  // Helper method for HTML validation checks
  protected hasError(controlName: string, errorName: string): boolean {
    const control = this.signupForm.get(controlName);
    return !!(control && control.hasError(errorName) && (control.touched || control.dirty));
  }

  protected submit(): void {
    
    console.log(`SUBMIT CLICKED`);
    console.log('FORM VALID:', this.signupForm.valid);
    console.log('FORM VALUE:', this.signupForm.getRawValue());
    

    this.formError.set('');

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    const { fullName, username, email, password, confirmPassword } =
      this.signupForm.getRawValue();

    if (password !== confirmPassword) {
      this.formError.set('Passwords do not match.');
      return;
    }

    this.isSubmitting.set(true);

    this.authApi
  .signUp({
    name: fullName,
    username,
    email,
    password
  })
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          void this.router.navigateByUrl('/login');
        },
        error: (error: any) => {
          // Extracts backend express validation error if available
          const apiMessage = error?.error?.message || error?.message || 'Failed to create account. Please try again.';
          this.formError.set(apiMessage);
        },
      });
  }
}
