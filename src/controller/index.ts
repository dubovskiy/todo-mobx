import ConnectService from "./service";
import {INewTask, ITask} from "../model";

class TodoController {
    static async loadAll() {
        try {
            const response = await ConnectService.loadAll();
            if (response.status === 200 || response.status === 201) {
                return {
                    success: true,
                    todos: response.data,
                };
            }
            throw new Error('Something went wrong');
        } catch (e) {
            return Promise.reject(new Error(e));
        }
    }

    static async createTodo(todo: INewTask) {
        try {
            const response = await ConnectService.create(todo);
            if (response.status === 200 || response.status === 201) {
                return {
                    success: true,
                    todos: response.data,
                };
            }

            throw new Error('Something went wrong');
        } catch (e) {
            return Promise.reject(new Error(e));
        }
    }

    static async updateTodo(todo: ITask) {
        try {
            const response = await ConnectService.update(todo);
            if (response.status === 200 || response.status === 201) {
                return {
                    success: true,
                    todos: response.data,
                };
            }
            throw new Error('Something went wrong');
        } catch (e) {
            return Promise.reject(new Error(e));
        }
    }

    static async removeTodo(id: number) {
        try {
            const response = await ConnectService.remove(id);
            if (response.status === 200 || response.status === 201) {
                return {
                    success: true,
                    todos: response.data,
                };
            }
            throw new Error('Something went wrong');
        } catch (e) {
            return Promise.reject(new Error(e));
        }
    }


}

export default TodoController;
