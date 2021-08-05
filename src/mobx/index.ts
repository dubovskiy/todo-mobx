import {makeAutoObservable} from "mobx";
import {INewTask, ITask, ITaskStatus} from "../model";
import TodoController from "../controller";

class Todo {
    maxId = -1;
    todoList = [] as ITask[];
    todoListHelper = {} as Record<number, ITaskStatus>;

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
            .catch(() => {
                this.removeItem(id);
                console.log('error');
            }).finally(() => {
                this.setPending(id, false);
            })
    }

    updateContent(updatedTask: ITask, withUndo:boolean = true) {
        const id = updatedTask.id;
        const task = this.getTask(id);
        if (task) {
            this.saveOldTitle(id);
            this.setPending(id, true);
            Object.assign(task, updatedTask);

            TodoController
                .updateTodo(task)
                .then(() => {
                    this.setPending(id, false);
                    if (withUndo) {
                        return new Promise((res) => {
                            this.saveTimeout(id, setTimeout(res, 5000));
                        })
                    }
                })
                .catch(() => {
                    this.setPending(id, false);
                    const oldTitle = this.todoFullList[id]?.oldTitle;
                    if (oldTitle) {
                        task.title = oldTitle;
                    }
                    console.log('error');
                }).finally(() => {
                    this.removeTimeout(id);
                    this.removeOldTitle(id);
                });
        }
    }

    updateStatus(id: number) {
        const task = this.getTask(id);
        if (task) {
            task.done = !task.done;
            this.setPending(id, true);

            TodoController
                .updateTodo(task)
                .catch(() => {
                    task.done = !task.done;
                    console.log('error');
                }).finally(() => {
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
            .then(() => {
                this.removeItem(id);
            }).catch(() => {
                console.log('error');
            }).finally(() => {
                this.setPending(id, false);
            })
    }

    setMaxId(id: number) {
        this.maxId = id;
    }
}
export default new Todo();
