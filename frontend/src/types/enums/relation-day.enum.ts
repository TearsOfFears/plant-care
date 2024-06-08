export enum RetationDayEnum {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}

export namespace RetationDayEnum {
  export function parseToApi(value: string): RetationDayEnum {
    switch (value) {
      case "MONDAY":
        return RetationDayEnum.MONDAY;
      case "TUESDAY":
        return RetationDayEnum.TUESDAY;
      case "WEDNESDAY":
        return RetationDayEnum.WEDNESDAY;
      case "THURSDAY":
        return RetationDayEnum.THURSDAY;
      case "FRIDAY":
        return RetationDayEnum.FRIDAY;
      case "SATURDAY":
        return RetationDayEnum.SATURDAY;
      case "SUNDAY":
        return RetationDayEnum.SUNDAY;
    }
    return RetationDayEnum.MONDAY;
  }
  export function parseFromString(value: RetationDayEnum): string {
    switch (value) {
      case RetationDayEnum.MONDAY:
        return "Monday";
      case RetationDayEnum.TUESDAY:
        return "Tuesday";
      case RetationDayEnum.WEDNESDAY:
        return "Wednesday";
      case RetationDayEnum.THURSDAY:
        return "Thursday";
      case RetationDayEnum.FRIDAY:
        return "Friday";
      case RetationDayEnum.SATURDAY:
        return "Saturday";
      case RetationDayEnum.SUNDAY:
        return "Sunday";
    }
    return RetationDayEnum.MONDAY;
  }
}
