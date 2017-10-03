export class Player {

  public uniqueId: string;
  public platform: {};
  public stats: {};
  public _name: string;

  constructor(player: any) {
    this.uniqueId = player.uniqueId;
    this.platform = player.platform;
    this.stats = player.stats;
    this.name = player.name;
  }

  set name(name: string) {
    this._name = name;
  }

  get name(): string {
    return this._name;
  }
}
