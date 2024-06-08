import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as process from 'process';

process.env.TZ = 'Europe/Kyiv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const appMqtt = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.MQTT,
      options: {
        subscribeOptions: { qos: 0 },
        //url: 'wss://f996edcbeabb4e9187e233820d073f59.s2.eu.hivemq.cloud:8884/mqtt',
        url: 'mqtt://127.0.0.1:1883',
        // username: 'nd_test',
        // password: 'FF@2HSCW7k47acd',
      },
    },
  );
  //mqtt://f996edcbeabb4e9187e233820d073f59.s2.eu.hivemq.cloud:8883/mqtt
  await appMqtt.listen();
  await app.listen(+process.env.PORT);
}
bootstrap();

//SELECT create_hypertable('sensors_entity', by_range('time'));
