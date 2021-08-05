import {INewTask, ITask} from "../model";
import api from "./api";

export default class ConnectService {
    static async loadAll() {
        return api.get(`/todos` );
    }

    static async create(todo: INewTask) {
        return api.post(`/todos`, {todo});
    }

    static async update(todo: ITask) {
        return api.put(`/todos/${todo.id}`, {todo});
    }

    static async remove(id:number) {
        return api.delete(`/todos/${id}`);
    }
}
