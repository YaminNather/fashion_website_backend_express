export default class Category {
  public constructor(
    public readonly id: string,
    private _categoryName: string
  ) {}

  public changeName(newName: string): void {
    this._categoryName = newName;
  }

  public get categoryName(): string {
    return this._categoryName;
  }  
}