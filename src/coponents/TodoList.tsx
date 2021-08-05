import TodoItemView from "./TodoItemView";
import {useContext, useState} from "react";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {Paper} from "@material-ui/core";
import TodoItemEdit from "./TodoItemEdit";

const TodoList = () => {
    const {store} = useContext(Context)
    const [editId, setEditId] = useState(-1);

    if (store.maxId === -1) {
        return <>Loading...</>
    }

    return (
        <>
        <Paper>
            {store.todoFullList.map((todoItem) => (
                editId === todoItem.id
                    ? <TodoItemEdit
                        key={todoItem.id}
                        item={todoItem}
                        onExit={() => setEditId(-1)}
                    />
                    : <TodoItemView
                        key={todoItem.id}
                        isUndo={!!todoItem.timeout}
                        item={todoItem}
                        onEdit={setEditId}
                        onRemove={(id) => store.remove(id)}
                    />
            ))}
        </Paper>
        {store.error && <Paper>{store.error}</Paper>}
            </>
    )
}

export default observer(TodoList);
