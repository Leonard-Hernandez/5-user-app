import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserService } from '../services/user.service';
import { findAll, findAllPageable, load, setPaginator } from './users.actions';
import { catchError, EMPTY, exhaustMap, map } from 'rxjs';
import { User } from '../models/user';

@Injectable()
export class UserEffects {
  loadUsers$: any;

  constructor(private actions$: Actions, private userService: UserService) {
    this.loadUsers$ = createEffect(() =>
      this.actions$.pipe(
        ofType(load),
        exhaustMap((action) =>
          this.userService.findAllPageable(action.page).pipe(
            map((pageable) => {
              const users = pageable.content as User[];
              const paginator = pageable;

              return findAllPageable({ users, paginator });
            }),
            catchError((err) => EMPTY)
          )
        )
      )
    );
  }
}
