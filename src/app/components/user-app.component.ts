import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { UserComponent } from "./user/user.component";
import { UserFormComponent } from './user-form/user-form.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'user-app',
  standalone: true,
  imports: [UserComponent, UserFormComponent],
  templateUrl: './user-app.component.html'
})
export class UserAppComponent implements OnInit{

  title: string = 'listado de usuarios!'

  users: User[] = [];

  userSelected: User = new User();

  open: boolean = false;

  constructor(private service: UserService){

  }

  ngOnInit(): void {
    this.service.findAll().subscribe(users => this.users=users);
    
  }

  addUser(user: User):void {
    if(user.id > 0){
      this.users = this.users.map( u => (u.id === user.id) ? {...user} : u);
    }else{
      this.users = [...this.users, user];      
    }
    Swal.fire({
      title: "Save",
      text: "User saved!",
      icon: "success"
    });
    this.userSelected = new User();
    if(this.open){
      this.setOpen();
    }
  }

  RemoveUser(id: number): void {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.users = this.users.filter(user => user.id !== id);
        Swal.fire({
          title: "Deleted!",
          text: "Your user has been deleted.",
          icon: "success"
        });
      }
    });
  }

  setSelectUser(userRow: User):void {
    this.userSelected = {... userRow};
    if(!this.open){
      this.setOpen();
    }
  }

  setOpen():void {
    this.open = !this.open;
  }
}
