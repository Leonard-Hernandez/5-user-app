import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserService } from '../services/user.service';
import {
  add,
  addSuccess,
  findAllPageable,
  load,
  setErrors,
  update,
  updateSuccess,
} from './users.actions';
import { catchError, EMPTY, exhaustMap, map, of, tap } from 'rxjs';
import { User } from '../models/user';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable()
export class UserEffects {
  loadUsers$: any;

  addUser$: any;

  addSuccess$: any;

  updateUser$ : any;

  updateSuccess$ : any;

  constructor(
    private actions$: Actions, 
    private userService: UserService,
    private router: Router
  )
    {
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

    this.addUser$ = createEffect(() =>
      this.actions$.pipe(
        ofType(add),
        exhaustMap((action) =>
          this.userService.create(action.userNew).pipe(
            map((userNew) => addSuccess({ userNew })),
            catchError((err) =>
              err.status == 400 ? of(setErrors({ errors: err.error })) : EMPTY
            )
          )
        )
      )
    );

    this.addSuccess$ = createEffect( () => 
      this.actions$.pipe(
        ofType(addSuccess),
        tap(() => {
          this.router.navigate(['/users']);

          Swal.fire({
            title: 'Save',
            text: 'User saved!',
            icon: 'success',
          });
        })
      )
      , {dispatch: false}
    )

    this.updateUser$ = createEffect(() =>
      this.actions$.pipe(
        ofType(update),
        exhaustMap((action) =>
          this.userService.update(action.userUpdated).pipe(
            map((userUpdated) => updateSuccess({ userUpdated })),
            catchError((err) =>
              err.status == 400 ? of(setErrors({ errors: err.error })) : EMPTY
            )
          )
        )
      )
    );

    this.updateSuccess$ = createEffect( () => 
      this.actions$.pipe(
        ofType(updateSuccess),
        tap(() => {
          this.router.navigate(['/users']);

          Swal.fire({
            title: 'Save',
            text: 'User saved!',
            icon: 'success',
          });
        })
      )
      , {dispatch: false}
    )

  }
}
