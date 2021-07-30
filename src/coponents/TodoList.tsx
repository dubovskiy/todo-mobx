import TodoItemView from "./TodoItemView";
import {useContext, useEffect, useState} from "react";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {Paper} from "@material-ui/core";
import TodoItemEdit from "./TodoItemEdit";
import TodoController from "../controller";
import {ITask} from "../model";

const TodoList = () => {
    const {store} = useContext(Context)
    const [editId, setEditId] = useState(-1);
    const [isLoading, setLoading] = useState(true);

    const onUpdate = (task:ITask) => {
        store.update(task);
    }

    useEffect(()=> {
        (async function () {
            const response = await TodoController.loadAll();
            if (response.success) {
                store.setList(response.todos.tasks)
                store.setMaxId(response.todos.id)
            }
            setLoading(false);
        })()
    }, []);

    if (isLoading) {
        return <>Loading...</>
    }
    return (
        <Paper>
            {store.todoList.map((todoItem) => (
                editId === todoItem.id
                    ? <TodoItemEdit
                        key={todoItem.id}
                        item={todoItem}
                        onUpdate={onUpdate}
                        onExit={() => setEditId(-1)}
                    />
                    : <TodoItemView
                        key={todoItem.id}
                        isUndo={!!store.todoListEditing[todoItem.id]}
                        item={{...todoItem, title: store.todoListEditing[todoItem.id] || todoItem.title}}
                        onEdit={setEditId}
                        onRemove={(id) => store.remove(id)}
                        onDone={(task) => store.update({...todoItem, done: task.done})}
                        onUndo={(id) => store.undo(id)}
                    />
            ))}
        </Paper>
    )
}

export default observer(TodoList);
