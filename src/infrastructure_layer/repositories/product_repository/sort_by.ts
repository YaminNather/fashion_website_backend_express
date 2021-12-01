export type SortField = "original_price" | "arrival_time";
export type SortDirection = "ascending" | "descending";

export default class SortBy {
  public constructor(field: SortField, options?: {direction?: SortDirection}) {
    this.field = field;

    if(options == undefined) {
      this.direction = "ascending";
      
      return;
    }

    this.direction = options.direction ?? "ascending";
  }

  public readonly field: SortField;
  public readonly direction: SortDirection;
}