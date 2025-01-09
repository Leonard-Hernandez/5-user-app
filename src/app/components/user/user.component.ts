import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SharingDataService } from '../../services/sharing-data.service';
import { PaginatorComponent } from '../paginator/paginator.component';
import { AuthService } from '../../services/auth.service';
import { Store } from '@ngrx/store';
import { load } from '../../store/users.actions';

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

  constructor(
    private store: Store<{ users: any }>,
    private service: UserService,
    private sharingDataService: SharingDataService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.store.select('users').subscribe((state) => {
      (this.users = state.users), (this.paginator = state.paginator);
    });
  }
  ngOnInit(): void {
    if (
      this.users == undefined ||
      this.users == null ||
      this.users.length == 0
    ) {
      this.route.paramMap.subscribe((params) => {
        const page = +(params.get('page') || 0);

        this.store.dispatch(load({ page }));
      });
    }
  }

  onRemoveUser(id: number): void {
    this.sharingDataService.idUserEventEmitter.emit(id);
  }

  onSelectUser(user: User): void {
    this.router.navigate(['/users/edit', user.id]);
  }

  get admin() {
    return this.authService.isAdmin();
  }
}
