import { Injectable } from '@angular/core';
import { Repository } from './repository';
import { Entity } from '../../models/entity';
import { EntityMessageSenderInterface } from './entity-message-sender';
import { EntityMessageReceiverInterface } from './entity-message-receiver';

@Injectable()
export class RepositoryFactoryService {
  create<T extends Entity>(sender: EntityMessageSenderInterface<T>, receiver: EntityMessageReceiverInterface<T>): Repository<T> {
    return new Repository<T>(sender, receiver);
  }
}
