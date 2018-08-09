export interface ChecklistItemEntity {
    id: number;
    uuid: string;
    order: number;
    checked: boolean;
    title: string;
    taskId: number;
}
