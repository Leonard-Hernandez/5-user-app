import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user';
import Swal from 'sweetalert2';
import { SharingDataService } from '../../services/sharing-data.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './auth.component.html'
})
export class AuthComponent {

  user: User;

  constructor(private authService: AuthService,
    protected router: Router
  ) {
    this.user = new User();
  }

  onSubmit(){
    if (!this.user.username || !this.user.password) {
      Swal.fire(
        'Error when login',
        'Please enter username and password',
        'error'
      );
    } else {
      this.authService.loginUser({ username: this.user.username, password: this.user.password }).subscribe({
        next: (response) => {
          const token = response.token;
          const payload = this.authService.getPayload(token);
          
          this.authService.user = {
            user:{ username: payload.sub },
            isAuth: true,
            isAdmin: payload.isAdmin,
          };
          this.authService.token = token;

          this.router.navigate(['/users']);
        },
        error: (error) => {
          if (error.status == 401) {
            Swal.fire({
              title: 'Error when login',
              text: error.error.message,
              icon: 'error',
            });
          } else {
            throw error;
          }
        },
      });
    }
  }

}
