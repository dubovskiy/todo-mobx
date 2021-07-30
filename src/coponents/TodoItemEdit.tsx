import React, {BaseSyntheticEvent, useRef, useState} from "react";
import {ITask} from "../model";
import {Box, Link, TextField} from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import NotInterestedIcon from '@material-ui/icons/NotInterested';

interface IProps{
    item: ITask,
    onUpdate: (item: ITask) => void
    onExit: () => void
}

const TodoItemEdit: React.FunctionComponent<IProps> = ({item, onUpdate, onExit}) => {
    const [title, setTitle] = useState(item.title);
    const onChange = (e: BaseSyntheticEvent) => setTitle(e.target.value);
    const onSubmit = (e: BaseSyntheticEvent) => {
        e.preventDefault();
        onUpdate({...item, title});
        onExit();
    }
    const onCancel = () => {
        setTitle(item.title);
        onExit();
    }

    const handleKeyPress = ({key}: {key:string}) => {
        if (key === 'Enter') {
            onUpdate({...item, title});
            onExit();
        } else if (key === 'Escape') {
            onCancel();
        }
    }


    return (
        <Box className="task-item">
            <form onSubmit={onSubmit}>
                <Box display="flex" flexWrap="nowrap" alignItems="center">
                <TextField
                    id="outlined-basic"
                    label="New task"
                    variant="outlined"
                    fullWidth
                    value={title}
                    onChange={onChange}
                    onKeyUp={handleKeyPress}
                />
                    <CheckCircleOutlineIcon onClick={() => handleKeyPress({key: 'Enter'})} className="link-item"/>
                    <NotInterestedIcon onClick={onCancel}  className="link-item"/>
                </Box>

            </form>
        </Box>
    )
}

export default TodoItemEdit
