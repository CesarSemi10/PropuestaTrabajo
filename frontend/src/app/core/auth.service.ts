import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'https://localhost:7152/api/Auth'; 

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<{ token: string }>(
      `${this.apiUrl}/login`,
      { username, password }
    ).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }
}
