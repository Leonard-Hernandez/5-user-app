import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../models/user';

@Component({
  selector: 'user',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html'
})
export class UserComponent {

  @Input() users: User[] = [];

  @Output() idUserEventEmitter = new EventEmitter<number>();

  @Output() onSelectedUserEventEmitter = new EventEmitter<User>();

  onRemoveUser(id: number):void {
    const confirmRemove = confirm("Estas seguro de eliminar el usuario?")
    if (confirmRemove){
      this.idUserEventEmitter.emit(id);
    }
  }

  onSelectUser(user: User):void {
    this.onSelectedUserEventEmitter.emit(user);
  }

}
