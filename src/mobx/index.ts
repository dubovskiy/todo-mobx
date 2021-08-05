import {makeAutoObservable} from "mobx";
import {INewTask, ITask, ITaskStatus} from "../model";
import TodoController from "../controller";

class Todo {
    maxId = -1;
    todoList:  ITask[] = [];
    todoListHelper: Record<number, ITaskStatus> = {};
    error = '';

    constructor() {
        TodoController
            .loadAll()
            .then((response) => {
                if (response.success) {
                    this.setList(response.todos.tasks);
                    this.setMaxId(response.todos.id);
                }
            });

        makeAutoObservable(this);
    }

    get todoFullList() {
        return this.todoList.map((item) => ({...item, ...this.todoListHelper[item.id]}))
    }

    setPending(id: number, value: boolean) {
        this.todoListHelper[id] = this.todoListHelper[id] || {};
        this.todoListHelper[id].isPending = value;
    }

    getTask(id: number) {
        return this.todoList.find((todo) => todo.id === id)
    }

    saveOldTitle(id: number) {
        const task = this.getTask(id);
        if (task) {
            this.todoListHelper[id] = this.todoListHelper[id] || {};
            this.todoListHelper[id].oldTitle = task.title;
        }
    }

    getOldTitle(id: number) {
        return this.todoListHelper[id]?.oldTitle;
    }

    removeOldTitle(id: number) {
        delete this.todoListHelper[id]?.oldTitle;
    }

    saveTimeout(id: number, timeout: NodeJS.Timeout) {
        this.todoListHelper[id] = this.todoListHelper[id] || {};
        this.todoListHelper[id].timeout = timeout;
    }

    removeTimeout(id: number) {
        delete this.todoListHelper[id]?.timeout;
    }


    setList(todoList: ITask[]) {
        this.todoList = todoList;
    }

    create(todoItem: INewTask) {
        const id = this.maxId;
        this.todoList.push({id, ...todoItem});
        this.maxId++;
        this.setPending(id, true);

        TodoController
            .createTodo(todoItem)
            .catch((e) => {
                this.removeItem(id);
                this.setError(e.message);
            })
            .finally(() => {
                this.setPending(id, false);
            });
    }

    private setError(msg?: string) {
        this.error = msg || 'Fatal Error';
        setTimeout(() => this.error = '', 5000);
    }

    updateContent(updatedTask: ITask, withUndo:boolean = true) {
        const id = updatedTask.id;
        const task = this.getTask(id);
        if (task) {
            this.saveOldTitle(id);
            Object.assign(task, updatedTask);
            if (withUndo) {
                const to = setTimeout(() => {
                    this.setPending(id, true);
                    TodoController
                        .updateTodo(task)
                        .catch((e) => {
                            const oldTitle = this.getOldTitle(id);
                            if (oldTitle) {
                                task.title = oldTitle;
                            }
                            this.setError(e.message);
                        }).finally(() => {
                            this.removeTimeout(id);
                            this.removeOldTitle(id);
                            this.setPending(id, false);
                        });
                }, 5000);
                this.saveTimeout(id, to);
            }
        }
    }

    updateStatus(id: number) {
        const task = this.getTask(id);
        if (task) {
            task.done = !task.done;
            this.setPending(id, true);

            TodoController
                .updateTodo(task)
                .catch((e) => {
                    task.done = !task.done;
                    this.setError(e.message);
                })
                .finally(() => {
                    this.setPending(id, false);
                });
        }
    }

    undo(id: number) {
        const task = this.getTask(id);
        const title = this.todoListHelper[id].oldTitle;
        if (task && title) {
            this.updateContent({...task, title }, false)
        }
    }

    private removeItem(id: number) {
        this.todoList = this.todoList.filter((todoItem) => todoItem.id !== id);
    }

    remove(id: number) {
        this.setPending(id, true);

        TodoController
            .removeTodo(id)
            .then(({success}) => {
                if (success) {
                    this.removeItem(id);
                }
            })
            .finally(() => {
                this.setPending(id, false);
            });
    }

    setMaxId(id: number) {
        this.maxId = id;
    }
}
export default new Todo();
