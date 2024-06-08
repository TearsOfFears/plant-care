import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import { Sequelize } from 'sequelize-typescript';
import { SensorsEntity } from '../entities/sensors.entity';

function getSSLConfig(env: string) {
  const configs = {
    production: { rejectUnauthorized: true },
    local: false,
    deploy: { rejectUnauthorized: false },
  };
  if (!configs[env] === undefined) {
    throw new Error('Set network in your .env file');
  }

  return configs[env];
}

const typeOrmConfigEnvs = async (
  withEntities: boolean,
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {
  if (withEntities) {
    return {
      host: configService.get<string>('POSTGRES_HOST'),
      port: configService.get<number>('POSTGRES_PORT_DB'),
      logging: ['error'],
      type: 'postgres',
      entities: ['dist/**/*.entity.{ts,js}'],
      migrations: ['dist/migration/**/*.{ts,js}'],
      subscribers: ['dist/**/*.subscriber.{ts,js}'],
      database: configService.get<string>('POSTGRES_DB'),
      username: configService.get<string>('POSTGRES_USER'),
      password: configService.get<string>('POSTGRES_PASSWORD'),
      ssl: getSSLConfig(configService.get<string>('SERVER_MODE')),
      synchronize: true,
    };
  }
  return {
    host: configService.get<string>('POSTGRES_HOST'),
    port: configService.get<number>('POSTGRES_PORT_DB'),
    type: 'postgres',
    database: configService.get<string>('POSTGRES_DB'),
    username: configService.get<string>('POSTGRES_USER'),
    password: configService.get<string>('POSTGRES_PASSWORD'),
  };
};
export const typeOrmConfig = (withEntities = false) => ({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleAsyncOptions> =>
    typeOrmConfigEnvs(withEntities, configService),
});

// export const databaseProviders = [
//   {
//     provide: 'SEQUELIZE',
//     useFactory: async (configService: ConfigService) => {
//       const sequelize = new Sequelize({
//         dialect: 'postgres',
//         host: configService.get<string>('POSTGRES_HOST'),
//         port: configService.get<number>('POSTGRES_PORT_DB'),
//         username: configService.get<string>('POSTGRES_USER'),
//         password: configService.get<string>('POSTGRES_PASSWORD'),
//         database: configService.get<string>('POSTGRES_DB'),
//       });
//       sequelize.addModels([SensorsEntity]);
//       await sequelize.sync();
//       return sequelize;
//     },
//     inject: [ConfigService],
//   },
// ];
