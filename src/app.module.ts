import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './users/users.module';
import { dataSourceOptions } from 'db/db-source';
import { CurrentUserMiddleware } from './common/middleware/current-user.middleware';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';
import { DbMongoModule } from './common/db-mongoose/db-mongo.module';
import { DbMongoMigrationService } from './common/db-mongoose/db-mongo-migration.service';
import { MessagesModule } from './messages/messages.module';
import { ChatGatewayModule } from './chat-gateway/chat-gateway.module';


@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions),
            UsersModule,
            ConfigModule.forRoot({isGlobal:true}),
            ChatModule,
            DbMongoModule,
            MessagesModule,
            ChatGatewayModule
          ],
  controllers: [AppController],
  providers: [AppService,DbMongoMigrationService ],
})
export class AppModule {
  configure(
    consumer: MiddlewareConsumer
  ){
    consumer.apply(CurrentUserMiddleware).forRoutes({path: '*', method: RequestMethod.ALL});
  }
}
