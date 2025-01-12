import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { SharingDataService } from '../services/sharing-data.service';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'user-app',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './user-app.component.html',
})
export class UserAppComponent implements OnInit {
  constructor(
    private sharingData: SharingDataService,
    private router: Router,
    private authServive: AuthService,
  ) {}

  ngOnInit(): void {
    this.handlerLogin();
  }

  handlerLogin(): void {
    this.sharingData.handlerLoginEventEmitter.subscribe(
      ({ username, password }) => {
        this.authServive.loginUser({ username, password }).subscribe({
          next: (response) => {
            const token = response.token;
            const payload = this.authServive.getPayload(token);

            const user = { username: payload.sub };
            const login = {
              user,
              isAuth: true,
              isAdmin: payload.isAdmin,
            };
            this.authServive.user = login;
            this.authServive.token = token;

            this.router.navigate(['/users']);
          },
          error: (error) => {
            if (error.status == 401) {
              Swal.fire({
                title: 'Error when login',
                text: error.error.message,
                icon: 'error',
              });
            } else {
              throw error;
            }
          },
        });
      }
    );
  }
}
