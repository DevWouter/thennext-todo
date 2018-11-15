

export interface EntityRefIdGeneratorInterface {
  next(): string;
}


export class EntityRefIdGenerator implements EntityRefIdGeneratorInterface {
  private _nextId = 0;

  constructor(
    private readonly tag: string,
    private readonly nowFunc = () => Date.now(),
    private readonly randomFunc = () => Math.random()) {
  }

  public next(): string {
    return `${this._nextId++}-${this.tag}-${this.nowFunc()}-${this.randomFunc()}`;
  }
}
