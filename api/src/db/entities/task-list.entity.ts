export class TaskListEntity {
    id: number;
    uuid: string;
    name: string;
    ownerId: number;
    privateKeyHash: string;
}

export interface WithTasklistUuid {
    taskListUuid: string;
}
