import React, {BaseSyntheticEvent, useContext, useState} from "react";
import {ITask} from "../model";
import {Box, TextField} from "@material-ui/core";
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import {Context} from "../index";
import {observer} from "mobx-react-lite";

interface IProps{
    item: ITask,
    onExit: () => void
}

const TodoItemEdit: React.FunctionComponent<IProps> = ({item, onExit}) => {
    const [title, setTitle] = useState(item.title);
    const onChange = (e: BaseSyntheticEvent) => setTitle(e.target.value);
    const {store} = useContext(Context)

    const onUpdate = (task: ITask) => {
        store.updateContent(task);
    }

    const onSubmit = (e: BaseSyntheticEvent) => {
        e.preventDefault();
        if (title.length) {
            onUpdate({...item, title});
        }
        onExit();
    }
    const onCancel = () => {
        setTitle(item.title);
        onExit();
    }

    const handleKeyPress = ({key}: {key:string}) => {
        if (key === 'Enter' && title.length) {
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

export default observer(TodoItemEdit)
