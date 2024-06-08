export enum ModeEnum{
    AUTO="Auto",
    MANUAL = "Manual",
    TIMER = "Timer"
}

export namespace ModeEnum {
    export function parseToApi(value:string): ModeEnum {
       switch (value){
           case "Auto": return ModeEnum.AUTO
           case "Manual": return ModeEnum.MANUAL
           case "Timer": return ModeEnum.TIMER
       }
       return ModeEnum.TIMER;
    }
    export function parseFromString(value:ModeEnum): string {
        switch (value){
            case  ModeEnum.AUTO: return "Auto"
            case  ModeEnum.MANUAL: return "Manual"
            case  ModeEnum.TIMER: return "Timer"
        }
        return ModeEnum.TIMER;
    }
}