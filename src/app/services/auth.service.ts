import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { login, logout } from '../store/auth/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url: string = 'http://localhost:8080/login';

  private _user: any;

  constructor(
    private http: HttpClient,
    private store: Store<{auth: any}>
  ) { 
    this.store.select('auth').subscribe((state) => this._user = state);
  }

  loginUser({ username, password }: any): Observable<any> {

    return this.http.post<any>(this.url, { username, password });
    
  }

  set user(user: any) {
    this.store.dispatch(login({ login: user }));
    sessionStorage.setItem('login', JSON.stringify(user));
  }

  get user() {
    return this._user;
  }

  set token(token: string) {
    sessionStorage.setItem('token', token);

  }

  get token() {
      return sessionStorage.getItem('token')!;
  }

  getPayload(token: string) {
    if (token != null){
      return JSON.parse(atob(token.split('.')[1]));
    }
    return null;
  }

  isAdmin(): boolean {
    return this.user.isAdmin;
  }

  authenticated(): boolean {
    return this.user.isAuth;
  }

  logout() {
    this.store.dispatch(logout())
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('login');

  }

}
