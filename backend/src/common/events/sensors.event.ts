export class TemperatureSendEvent {
  constructor(public readonly tmp: number) {}
}

export class MoistureSendEvent {
  constructor(public readonly moisture: number) {}
}

export class IsWaterSendEvent {
  constructor(public readonly isWater: boolean) {}
}
//
// export class TeacherBgCheckEvent{
//     constructor(
//         public readonly user: UserEntity
//     ) {}
// }
