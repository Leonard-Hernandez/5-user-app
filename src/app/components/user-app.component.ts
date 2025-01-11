import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { SharingDataService } from '../services/sharing-data.service';
import { AuthService } from '../services/auth.service';
import { Store } from '@ngrx/store';
import { remove } from '../store/users.actions';

@Component({
  selector: 'user-app',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './user-app.component.html',
})
export class UserAppComponent implements OnInit {
  constructor(
    private service: UserService,
    private sharingData: SharingDataService,
    private router: Router,
    private authServive: AuthService,
    private store: Store<{ users: any }>
  ) {}

  ngOnInit(): void {
    this.RemoveUser();
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

  RemoveUser(): void {
    this.sharingData.idUserEventEmitter.subscribe((id) => {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.service.delete(id).subscribe(() => {
            this.store.dispatch(remove({ id }));
            this.router
              .navigate(['/users/create'], { skipLocationChange: true })
              .then(() => {
                this.router.navigate(['/users']);
              });
          });

          Swal.fire({
            title: 'Deleted!',
            text: 'Your user has been deleted.',
            icon: 'success',
          });
        }
      });
    });
  }
}
