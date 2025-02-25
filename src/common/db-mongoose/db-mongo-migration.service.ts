import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { config, database, up } from "migrate-mongo";

@Injectable()
export class DbMongoMigrationService implements OnModuleInit{
    private readonly dbMigrationConfig: Partial<config.Config>={
        mongodb:{
            databaseName: this.configService.get('MONGO_DB_NAME'),
            url: this.configService.get('MONGO_URI') as string,
        },
        migrationsDir:`${__dirname}/../../../mongo-migrations`,
        changelogCollectionName: 'changelog',
        migrationFileExtension: '.js'
    }

    constructor(private readonly configService: ConfigService) {}

    async onModuleInit() {

        config.set(this.dbMigrationConfig);
        const {db, client}=await database.connect();
        await up(db, client);
    }
}