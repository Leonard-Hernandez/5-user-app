import { EventEmitter, Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class SharingDataService {

  private _newUserEventEmitter: EventEmitter<User> = new EventEmitter<User>();

  private _idUserEventEmitter: EventEmitter<number> = new EventEmitter<number>();

  private _findUserById: EventEmitter<number> = new EventEmitter<number>();

  private _selectUserEventEmitter: EventEmitter<User> = new EventEmitter<User>();

  private _errorsUserFormEventEmmiter: EventEmitter<any> = new EventEmitter<any>();

  private _pageUsersEventEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  get newUserEventEmitter(): EventEmitter<User> {
    return this._newUserEventEmitter;
  }

  get idUserEventEmitter(): EventEmitter<number> {
    return this._idUserEventEmitter;
  }

  get findUserById(): EventEmitter<number>{
    return this._findUserById;
  }

  get selectUserEventEmitter(): EventEmitter<User>{
    return this._selectUserEventEmitter;
  }

  get errorsUserFormEventEmmiter(): EventEmitter<any>{
    return this._errorsUserFormEventEmmiter;
  }

  get pageUsersEventEmitter(): EventEmitter<any>{
    return this._pageUsersEventEmitter;
  }
}
