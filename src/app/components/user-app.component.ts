import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { SharingDataService } from '../services/sharing-data.service';
import { AuthService } from '../services/auth.service';
import { Store } from '@ngrx/store';
import { add, find, findAll, remove, setPaginator, update } from '../store/users.actions';

@Component({
  selector: 'user-app',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './user-app.component.html',
})
export class UserAppComponent implements OnInit {

  user!: User;

  constructor(
    private service: UserService,
    private sharingData: SharingDataService,
    private router: Router,
    private authServive: AuthService,
    private store: Store<{users: any}>
  ) {
    this.store.select('users').subscribe(state => {
      this.user = {... state.user}
    })
  }

  ngOnInit(): void {
    this.addUser();
    this.RemoveUser();
    this.findUserById();
    this.pageUsersEvent();
    this.handlerLogin();
  }

  handlerLogin(): void {
    this.sharingData.handlerLoginEventEmitter.subscribe(({username, password}) =>{
      this.authServive.loginUser({username, password}).subscribe({
        next: response => {
          const token = response.token;
          const payload = this.authServive.getPayload(token);

          const user = {username: payload.sub};
          const login = {
            user,
            isAuth: true,
            isAdmin: payload.isAdmin
          }
          this.authServive.user = login;
          this.authServive.token = token;

          this.router.navigate(['/users']);
        },
        error: error => {
          if(error.status == 401) {
            Swal.fire({
              title: 'Error when login',
              text: error.error.message,
              icon: 'error'
            });
          } else {
            throw error;
          }
        }
      })
    });
  }

  findUserById() {
    this.sharingData.findUserById.subscribe((id) => {
      this.store.dispatch(find({id}))
      this.sharingData.selectUserEventEmitter.emit(this.user);
    });
  }

  pageUsersEvent(): void{
    this.sharingData.pageUsersEventEmitter.subscribe((pageable) => {
      this.store.dispatch(findAll({users: pageable.users}))
      this.store.dispatch(setPaginator({paginator: pageable.paginator}))
    });
  }

  addUser(): void {
    this.sharingData.newUserEventEmitter.subscribe((user) => {
      if (user.id > 0) {
        this.service.update(user).subscribe({
          next: (userUpdated) => {
            this.store.dispatch(update({ userUpdated }));
            this.router.navigate(['/users']);

            Swal.fire({
              title: 'Save',
              text: 'User saved!',
              icon: 'success',
            });
          },
          error: (err) => {
            console.log(err);
            if ((err.status = 400)) {
              this.sharingData.errorsUserFormEventEmmiter.emit(err);
            }
          },
        });
      } else {
        this.service.create(user).subscribe({
          next: (userNew) => {
            this.store.dispatch(add({ userNew }));
            this.router.navigate(['/users']);

            Swal.fire({
              title: 'Save',
              text: 'User saved!',
              icon: 'success',
            });
          },
          error: (err) => {
            console.log(err);
            if (err.status == 400) {
              this.sharingData.errorsUserFormEventEmmiter.emit(err);
            }
          },
        });
      }
    });
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
            this.store.dispatch(remove({id}));
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
