import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { SharingDataService } from '../services/sharing-data.service';

@Component({
  selector: 'user-app',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './user-app.component.html',
})
export class UserAppComponent implements OnInit {
  
  users: User[] = [];

  constructor(
    private service: UserService,
    private sharingData: SharingDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.service.findAll().subscribe((users) => (this.users = users));
    this.addUser();
    this.RemoveUser();
    this.findUserById();
  }

  findUserById(){
    this.sharingData.findUserById.subscribe(id =>{

      const user = this.users.find(user => user.id == id);

      this.sharingData.selectUserEventEmitter.emit(user);
      
    })

  }

  addUser(): void {
    this.sharingData.newUserEventEmitter.subscribe(user => {

      console.log(user + "desde addUser");

      if (user.id > 0) {

        this.service.update(user).subscribe(userUpdated => {
          this.users = this.users.map(u => (u.id === userUpdated.id ? { ...userUpdated } : u));
        });

      } else {

        this.service.create(user).subscribe(userCreated => {

          this.users = [... this.users, {...userCreated}];
          
        })
      }

      console.log(this.users);
      this.router.navigate(['/users'], {state: {users: this.users}});
      Swal.fire({
        title: 'Save',
        text: 'User saved!',
        icon: 'success',
      });
    })
  }

  RemoveUser(): void {
    this.sharingData.idUserEventEmitter.subscribe(id => {
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
          this.users = this.users.filter(user => user.id != id);
          this.router.navigate(['/users/create'], { skipLocationChange: true }).then(() => {
            this.router.navigate(['/users'], { state: { users: this.users } });
          });
          Swal.fire({
            title: 'Deleted!',
            text: 'Your user has been deleted.',
            icon: 'success',
          });
        }
      });
    })
  }
}
