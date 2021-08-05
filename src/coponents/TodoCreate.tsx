import {Box, IconButton, Paper, TextField} from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import React, {BaseSyntheticEvent, FormEventHandler, useContext, useState} from "react";
import {Context} from "../index";
import {observer} from "mobx-react-lite";

const TodoCreate = () => {
    const [title, setTitle] = useState<string>('')
    const {store} = useContext(Context)


    const onChange = (event: BaseSyntheticEvent) => setTitle(event.target.value);

    const onSubmit: FormEventHandler = (e:BaseSyntheticEvent) => {
        e.preventDefault();
        if (!title) {
            return null
        }
        const todo = {
            title,
            done: false
        };

        store.create(todo);
        setTitle('');
    }
    return (
        <Box width={600} ml="auto" mr="auto" p="20px">
            <Paper>
                <form onSubmit={onSubmit}>
                    <Box display="flex"  p="20px">
                        <TextField
                            id="outlined-basic"
                            label="New task"
                            variant="outlined"
                            fullWidth
                            value={title}
                            onChange={onChange}
                        />
                        <IconButton type="submit" aria-label="search">
                            <AddCircleIcon fontSize="large" />
                        </IconButton>
                    </Box>
                </form>
            </Paper>
        </Box>
    )
}

export default observer(TodoCreate);
