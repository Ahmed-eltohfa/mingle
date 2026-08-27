import { Component, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

import { AuthApiService } from '../services/auth-api.service';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {

  protected readonly isPasswordVisible = signal(false);

  protected readonly loginForm = new FormGroup({

    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),

    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),

    rememberMe: new FormControl(false)

  });


  constructor(
    private authApi: AuthApiService,
    private router: Router
  ) {}


  togglePasswordVisibility() {

    this.isPasswordVisible.update(
      value => !value
    );

  }


  submit() {

    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      return;

    }


    const email =
      this.loginForm.value.email!;

    const password =
      this.loginForm.value.password!;


    this.authApi.signIn({
      email,
      password
    }).subscribe({

      next: (response) => {

        console.log('Login successful:', response);

        localStorage.setItem(
          'token',
          response.data.token
        );

        this.router.navigate(['/home']);

      },


      error: (error) => {

        console.error('Login failed:', error);

        alert(
          error.error?.message ||
          'Invalid email or password'
        );

      }

    });

  }

}