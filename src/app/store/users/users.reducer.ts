import { createReducer, on } from "@ngrx/store";
import { addSuccess, find, findAll, findAllPageable, remove, removeSuccess, resetUser, setErrors, setPaginator, update, updateSuccess } from "./users.actions";
import { User } from "../../models/user";

const users: User[] = [];
const user: User = new User();

export const userReducer = createReducer(
    {
        users,
        paginator: {},
        user,
        errors: {}
    },
    on(resetUser, (state) => ({
        users: state.users,
        paginator: state.paginator,
        user:{...user},
        errors: {}
    })),
    on(find, (state, { id }) => ({
        users: state.users,
        paginator: state.paginator,
        user: state.users.find((u) => u.id === id) || new User(),
        errors: state.errors
    })),
    on(findAll, (state, {users}) => ( {
            users: [...users],
            paginator: state.paginator,
            user: state.user,
            errors: state.errors
        }
    )),
    on(findAllPageable, (state, {users, paginator}) => ( {
        users: [...users],
        paginator: {...paginator},
        user: state.user,
        errors: state.errors
    }
    )),
    on(setPaginator, (state, {paginator}) => ({
        users: state.users,
        paginator:{...paginator},
        user: state.user,
        errors: state.errors
    })),
    on(addSuccess, (state, {userNew}) => ({
        users: [...state.users, {... userNew}],
        paginator: state.paginator,
        user: {... user},
        errors: {}
    })),
    on(updateSuccess, (state, {userUpdated}) => ({
        users: state.users.map((u) => u.id === userUpdated.id ? {...userUpdated} : u),
        paginator: state.paginator,
        user: {... user},
        errors: {}
    })),
    on(removeSuccess, (state, {id}) => ({
        users: state.users.filter(u => u.id != id),
        paginator: state.paginator,
        user: state.user,
        errors: state.errors
    })),
    on(setErrors, (state, { userForm, errors}) => ({
        users: state.users,
        paginator: state.paginator,
        user: {... userForm},
        errors: {...errors}
    }))
)