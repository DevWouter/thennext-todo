import { Entity } from "../../models/entity";
import { Observable } from "rxjs";

export interface EntityMessageReceiverInterface<T extends Entity> {
  onAdd(): Observable<{ data: T }>;
  onUpdate(): Observable<{ data: T }>;
  onRemove(): Observable<{ uuid: string }>;
}
