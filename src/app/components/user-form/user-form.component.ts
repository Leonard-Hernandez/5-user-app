import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'user-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-form.component.html'
})
export class UserFormComponent {

  @Input() user: User;

  @Output() newUserEventEmitter = new EventEmitter<User>();

  @Output() openEventEmitter = new EventEmitter<boolean>();

  constructor() {
    this.user = new User();
  }

  onSubmit(userForm: NgForm):void {
    if (userForm.valid){
      this.newUserEventEmitter.emit(this.user);
      console.log(this.user);
    }
    this.onClear(userForm);
  }

  onClear(userForm: NgForm):void {
    this.user = new User();
    userForm.reset();
    userForm.resetForm();
  }

  onOpen():void {
    this.openEventEmitter.emit();
  }

}
