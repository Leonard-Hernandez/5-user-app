import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {

  @Input() users: User[] = [];

  @Input() paginator: any = {};

  constructor(private authService: AuthService) { }

  get login(){
    return this.authService.user;
  }

  get admin(): boolean{
    return this.authService.isAdmin();
  }
}
