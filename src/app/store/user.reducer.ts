import { createReducer, on } from "@ngrx/store";
import { User } from "../models/user";
import { add, find, findAll, remove, setPaginator, update } from "./user.actions";
import { state } from "@angular/animations";

const users: User[] = [];
const user: User = new User();

export const userReducer = createReducer(
    {
        users,
        paginator: {},
        user
    },
    on(findAll, (state, {users}) => ( {
            users: [...users],
            paginator: state.paginator,
            user: state.user
        }
    )),
    on(find, (state, { id }) => ({
        users: state.users,
        paginator: state.paginator,
        user: state.users.find((u) => u.id === id) || new User()
    })),
    on(setPaginator, (state, {paginator}) => ({
        users: state.users,
        paginator:{...paginator},
        user: state.user
    })),
    on(add, (state, {userNew}) => ({
        users: [...state.users, {... userNew}],
        paginator: state.paginator,
        user: state.user
    })),
    on(update, (state, {userUpdated}) => ({
        users: state.users.map((u) => u.id === userUpdated.id ? {...userUpdated} : u),
        paginator: state.paginator,
        user: state.user
    })),
    on(remove, (state, {id}) => ({
        users: state.users.filter(u => u.id != id),
        paginator: state.paginator,
        user: state.user
    }))
)