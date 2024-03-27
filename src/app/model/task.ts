import { Subtask } from "./subtask";

export interface Task {
    _id: string,
    title: string,
    description: string,
    status: string,
    subtasks: Subtask[]
}
