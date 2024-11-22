import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { UserComponent } from "./user/user.component";
import { UserFormComponent } from './user-form/user-form.component';

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
    this.userSelected = new User();
  }

  RemoveUser(id: number): void {
    this.users = this.users.filter(user => user.id !== id);
  }

  setSelectUser(userRow: User):void {
    this.userSelected = {... userRow};
  }
}
