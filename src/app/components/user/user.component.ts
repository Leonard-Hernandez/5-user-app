import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SharingDataService } from '../../services/sharing-data.service';
import { PaginatorComponent } from '../paginator/paginator.component';
import { AuthService } from '../../services/auth.service';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';
import { load, remove } from '../../store/users/users.actions';

@Component({
  selector: 'user',
  standalone: true,
  imports: [RouterModule, PaginatorComponent],
  templateUrl: './user.component.html',
})
export class UserComponent implements OnInit {
  title: string = 'listado de usuarios!';

  pageUrl: string = '/users/page';

  users: User[] = [];

  paginator: any = {};

  loading: boolean = true;

  constructor(
    private store: Store<{ users: any }>,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.store.select('users').subscribe((state) => {
      (this.users = state.users), (this.paginator = state.paginator), (this.loading = state.loading);
    });
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.store.dispatch(load({ page: +(params.get('page') || 0) }));
    });
  }

  onRemoveUser(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.store.dispatch(remove({ id }));
      }
    });
  }

  onSelectUser(user: User): void {
    this.router.navigate(['/users/edit', user.id]);
  }

  get admin() {
    return this.authService.isAdmin();
  }
}
