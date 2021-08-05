type TContent = string;

export interface ITask {
    id: number
    title: TContent
    done: boolean
}

export interface ITaskStatus{
    isPending?: boolean
    oldTitle?: TContent
    timeout?: NodeJS.Timeout
}

export type IFullTask = ITask & ITaskStatus;

export type INewTask = Omit<ITask, 'id'>
