export class TaskListEntity {
    id: number;
    uuid: string;
    name: string;
    ownerId: number;
}

export interface WithTasklistUuid {
    taskListUuid: string;
}
