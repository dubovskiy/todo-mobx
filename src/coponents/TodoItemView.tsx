import React, {useState} from "react";
import {ITask} from "../model";
import {Box, Link} from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

interface IProps{
    item: ITask
    isUndo: boolean
    onEdit: (id: number) => void
    onRemove: (id: number) => void
    onUndo: (id: number) => void
    onDone: (task: ITask) => void
}
const TodoItemView: React.FunctionComponent<IProps> = ({item, onEdit, onRemove, onDone, isUndo, onUndo}) => {
    const [isHover, setHover] = useState(false);

    const onDoneHandler = () => {
        onDone({...item, done: !item.done})
    }

    return (
        <Box className="task-item"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div onClick={onDoneHandler} className="link-item">
                {item.done ? <s>{item.title}</s> : item.title}
            </div>
            <div className="task-settings">

            {isUndo ? <Link onClick={()=> onUndo(item.id)}>Undo...</Link>
                : isHover && (
                <>
                    <EditIcon onClick={() => onEdit(item.id)} />
                    <HighlightOffIcon onClick={() => onRemove(item.id)} />
                </>
            )}

            </div>
        </Box>
    )
}

export default TodoItemView
