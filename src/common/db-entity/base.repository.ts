import { Repository, DeepPartial, FindOneOptions, FindOptionsWhere } from 'typeorm';
import { BaseEntity } from './base.entity';

export abstract class BaseRepository<T extends BaseEntity> {
  protected constructor(private readonly repository: Repository<T>) {}

  async findAll(): Promise<T[]> {
    return await this.repository.find();
  }

  async findOneById(id: number | string): Promise<T | null> {
    return await this.repository.findOne({ where: { id } as FindOptionsWhere<T> });
  }
  
  async save(entity: DeepPartial<T>): Promise<T> {
    return await this.repository.save(entity);
  }

  async create(entity: DeepPartial<T>): Promise<T> {
    return this.repository.create(entity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
