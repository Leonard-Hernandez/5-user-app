import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private users: User[] = [{
    id: 1,
    name: 'leonard',
    lastname: 'hernandez',
    email:'leonard@example.com',
    username:'leonardUser',
    password:'123456'
  },
  {
    id: 2,
    name: 'lubraska',
    lastname: 'ferreira',
    email:'lubraska@example.com',
    username:'lubraskaUser',
    password:'123456'
  },{
    id: 3,
    name: 'andres',
    lastname: 'guzman',
    email:'andres@example.com',
    username:'andresUser',
    password:'123456'
  }]

  constructor() { }

  findAll(): Observable<User[]> {
    return of(this.users);
  }
}
