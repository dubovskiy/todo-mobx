import {makeAutoObservable} from "mobx";
import {INewTask, ITask} from "../model";
import TodoController from "../controller";

class Todo {
    maxId = 0;
    todoList = [] as ITask[];
    todoListEditing = {} as Record<number, ITask['title']>;
    todoListEditingTimeouts = {} as Record<number, NodeJS.Timeout>;

    constructor() {
        makeAutoObservable(this);
    }

    setList(todoList: ITask[]) {
        this.todoList = todoList;
    }

    create(todoItem: INewTask) {
        this.todoList.push({id: this.maxId, ...todoItem});
        this.maxId++;
    }

    update(updatedTask: ITask) {
        const id = updatedTask.id;
        const task = this.todoList.find((todo) => todo.id === id);
        console.log(updatedTask);
        if (task?.title !== updatedTask.title) {
            this.todoListEditing[id] = updatedTask.title;
            this.todoListEditingTimeouts[id] = setTimeout(() => {
                Object.assign(task, updatedTask);
                TodoController.updateTodo(updatedTask);
                delete this.todoListEditing[id];
                delete this.todoListEditingTimeouts[id];
            }, 50000);
        } else {
            Object.assign(task, updatedTask);
            TodoController.updateTodo(updatedTask);
        }
    }

    undo(id: number) {
        clearTimeout(this.todoListEditingTimeouts[id]);
        delete this.todoListEditingTimeouts[id];
        delete this.todoListEditing[id];
    }

    remove(id: number) {
        this.todoList = this.todoList.filter((todoItem) => todoItem.id !== id);
    }


    setMaxId(id: number) {
        this.maxId = id;
    }
}
export default new Todo();
