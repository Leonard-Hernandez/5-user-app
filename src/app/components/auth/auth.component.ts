import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { login } from '../../store/auth/auth.actions';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './auth.component.html'
})
export class AuthComponent {

  user: User = new User();

  constructor(
    private store: Store<{auth: any}>,
    private router: Router
  ) {
    
  }

  onSubmit(){
    if (!this.user.username || !this.user.password) {
      Swal.fire(
        'Error when login',
        'Please enter username and password',
        'error'
      );
    } else {
      this.store.dispatch(login({username: this.user.username, password: this.user.password}));
    }
  }

}
