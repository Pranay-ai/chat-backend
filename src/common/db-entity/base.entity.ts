import { CreateDateColumn, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";


export abstract class BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @CreateDateColumn()
    createdAt: Timestamp;

    @UpdateDateColumn()
    updatedAt: Timestamp;
}   