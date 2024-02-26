import { Subtask } from "./subtask";

export interface Task {
    title: string,
    description: string,
    status: string,
    subtasks: Subtask[]
}
