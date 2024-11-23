import { EventEmitter, Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class SharingDataService {

  private _newUserEventEmitter: EventEmitter<User> = new EventEmitter<User>();

  private _idUserEventEmitter = new EventEmitter<number>();

  private _onSelectedUserEventEmitter = new EventEmitter<User>();

  constructor() { }

  get newUserEventEmitter(): EventEmitter<User> {
    return this._newUserEventEmitter;
  }

  get idUserEventEmitter(): EventEmitter<number> {
    return this._idUserEventEmitter;
  }

  get onSelectedUserEventEmitter(): EventEmitter<User> {
    return this._onSelectedUserEventEmitter;
  }

}
