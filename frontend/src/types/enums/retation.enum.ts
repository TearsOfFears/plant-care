export enum RetationEnum {
  DAY = "DAY",
  WEEKEND = "WEEKEND",
  MONTH = "MONTH",
}

export namespace RetationEnum {
  export function parseToApi(value: string): RetationEnum {
    switch (value) {
      case "WEEKEND":
        return RetationEnum.WEEKEND;
      case "MONTH":
        return RetationEnum.MONTH;
      case "DAY":
        return RetationEnum.DAY;
    }
    return RetationEnum.DAY;
  }
  export function parseFromString(value: RetationEnum): string {
    switch (value) {
      case RetationEnum.WEEKEND:
        return "Weekend";
      case RetationEnum.MONTH:
        return "Month";
      case RetationEnum.DAY:
        return "Day";
    }
    return RetationEnum.DAY;
  }
}
