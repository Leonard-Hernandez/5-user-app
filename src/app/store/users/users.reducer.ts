import { createReducer, on } from "@ngrx/store";
import { addSuccess, find, findAll, findAllPageable, load, remove, removeSuccess, resetUser, setErrors, setPaginator, update, updateSuccess } from "./users.actions";
import { User } from "../../models/user";

const users: User[] = [];
const user: User = new User();

export const userReducer = createReducer(
    {
        users,
        paginator: {},
        user,
        errors: {},
        loading: true
    },
    on(resetUser, (state) => ({
        users: state.users,
        paginator: state.paginator,
        user:{...user},
        errors: {},
        loading: state.loading
    })),
    on(find, (state, { id }) => ({
        users: state.users,
        paginator: state.paginator,
        user: state.users.find((u) => u.id === id) || new User(),
        errors: state.errors,
        loading: state.loading
    })),
    on(findAll, (state, {users}) => ( {
            users: [...users],
            paginator: state.paginator,
            user: state.user,
            errors: state.errors,
            loading: false
        }
    )),
    on(findAllPageable, (state, {users, paginator}) => ( {
        users: [...users],
        paginator: {...paginator},
        user: state.user,
        errors: state.errors,
        loading: false
    }
    )),
    on(setPaginator, (state, {paginator}) => ({
        users: state.users,
        paginator:{...paginator},
        user: state.user,
        errors: state.errors,
        loading: state.loading
    })),
    on(addSuccess, (state, {userNew}) => ({
        users: [...state.users, {... userNew}],
        paginator: state.paginator,
        user: {... user},
        errors: {},
        loading: state.loading
    })),
    on(updateSuccess, (state, {userUpdated}) => ({
        users: state.users.map((u) => u.id === userUpdated.id ? {...userUpdated} : u),
        paginator: state.paginator,
        user: {... user},
        errors: {},
        loading: state.loading
    })),
    on(removeSuccess, (state, {id}) => ({
        users: state.users.filter(u => u.id != id),
        paginator: state.paginator,
        user: state.user,
        errors: state.errors,
        loading: state.loading
    })),
    on(setErrors, (state, { userForm, errors}) => ({
        users: state.users,
        paginator: state.paginator,
        user: {... userForm},
        errors: {...errors},
        loading: state.loading
    }))
)