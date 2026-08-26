import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:5000/api/auth';

  signIn(data: any) {
  return this.http.post<any>(
    `${this.apiUrl}/login`,
    data
  );
}
  signUp(data: any) {
    return this.http.post<any>(
      `${this.apiUrl}/register`,
      data
    );
  }

}
