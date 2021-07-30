export interface ITask{
    id: number
    title: string
    done: boolean
}

export type INewTask = Omit<ITask, 'id'>
