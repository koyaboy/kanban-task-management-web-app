import { Column } from "./column"

export interface Board {
    _id: string,
    name: string,
    columns?: Column[]
}
