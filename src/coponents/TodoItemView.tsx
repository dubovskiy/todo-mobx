import React, {useContext, useState} from "react";
import {IFullTask} from "../model";
import {Box, Link} from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import {observer} from "mobx-react-lite";
import classNames from "classnames";
import {Context} from "../index";

interface IProps{
    item: IFullTask
    isUndo: boolean
    onEdit: (id: number) => void
    onRemove: (id: number) => void
}
const TodoItemView: React.FunctionComponent<IProps> = ({item, onEdit, onRemove, isUndo}) => {
    const [isHover, setHover] = useState(false);
    const {store} = useContext(Context)

    const onUndo = () => {
        store.undo(item.id);
    }

    const onDone = () => {
        store.updateStatus(item.id);
    }

    return (
        <Box className={classNames('task-item', { 'pending': item.isPending})}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div onClick={onDone} className="link-item">
                {item.done ? <s>{item.title}</s> : item.title}
            </div>
            <div className="task-settings">

            {isUndo ? <Link onClick={onUndo}>Undo...</Link>
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

export default observer(TodoItemView)
