import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './users/users.module';
import { dataSourceOptions } from 'db/db-source';
import { CurrentUserMiddleware } from './common/middleware/current-user.middleware';
import { UsersService } from './users/users.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), UsersModule, ConfigModule.forRoot({isGlobal:true})],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(
    consumer: MiddlewareConsumer
  ){
    consumer.apply(CurrentUserMiddleware).forRoutes({path: '*', method: RequestMethod.ALL});
  }
}
