import { Entity } from "../../models/entity";
import { Observable } from "rxjs";

export interface EntityMessageReceiverInterface<T extends Entity> {
  onAdd(): Observable<{ data: T }>;
  onUpdate(): Observable<{ data: T }>;
  onRemove(): Observable<{ uuid: string }>;
}

export class EntityMessageReceiver<T extends Entity> implements EntityMessageReceiverInterface<T> {
  onAdd(): Observable<{ data: T; }> {
    throw new Error("Method not implemented.");
  }

  onUpdate(): Observable<{ data: T; }> {
    throw new Error("Method not implemented.");
  }

  onRemove(): Observable<{ uuid: string; }> {
    throw new Error("Method not implemented.");
  }
}
