import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  add,
  addSuccess,
  findAllPageable,
  load,
  remove,
  removeSuccess,
  setErrors,
  update,
  updateSuccess,
} from './users.actions';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Injectable()
export class UserEffects {
  loadUsers$: any;

  addUser$: any;

  addSuccess$: any;

  updateUser$: any;

  updateSuccess$: any;

  removeUser$: any;

  removeSuccessUser$: any;

  constructor(
    private actions$: Actions,
    private userService: UserService,
    private router: Router
  ) {
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
            catchError((err) => of(err))
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
              err.status == 400 ? of(setErrors({ userForm: action.userNew, errors: err.error })) : of(err)
            )
          )
        )
      )
    );

    this.addSuccess$ = createEffect(
      () =>
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
        ),
      { dispatch: false }
    );

    this.updateUser$ = createEffect(() =>
      this.actions$.pipe(
        ofType(update),
        exhaustMap((action) =>
          this.userService.update(action.userUpdated).pipe(
            map((userUpdated) => updateSuccess({ userUpdated })),
            catchError((err) =>
              err.status == 400 ? of(setErrors({ userForm: action.userUpdated, errors: err.error })) : of(err)
            )
          )
        )
      )
    );

    this.updateSuccess$ = createEffect(
      () =>
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
        ),
      { dispatch: false }
    );

    this.removeUser$ = createEffect(() =>
      this.actions$.pipe(
        ofType(remove),
        exhaustMap((action) =>
          this.userService.delete(action.id).pipe(
            map((id) => removeSuccess({ id: id })),
          )
        )
      )
    );

    this.removeSuccessUser$ = createEffect(() =>
      this.actions$.pipe(
        ofType(removeSuccess),
        tap(() => {
          console.log('removeSuccess');
          this.router.navigate(['/users']);
          Swal.fire({
            title: 'Deleted!',
            text: 'Your user has been deleted.',
            icon: 'success',
          });
        })
      ),
      { dispatch: false }
    );
  }
}
