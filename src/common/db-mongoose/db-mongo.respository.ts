import { Model } from 'mongoose';
import { BaseSchema } from './db-monogo.schema';

export abstract class AbstractRepository<T extends BaseSchema> {
  constructor(protected readonly model: Model<T>) {}

  /**
   * Create a new document
   * @param data partial object to create
   * @returns created document
   */
  async create(data: Partial<T>): Promise<T> {
    const doc = new this.model(data);
    return doc.save();
  }

  /**
   * Find all documents
   * @returns array of documents
   */
  async findAll(): Promise<T[]> {
    return this.model.find().exec();
  }

  /**
   * Find a document by its ID
   * @param id document id
   * @returns found document or null
   */
  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  /**
   * Update a document by its ID
   * @param id document id
   * @param data partial object to update
   * @returns updated document or null
   */
  async update(id: string, data: Partial<T>): Promise<T | null> {
    // If you want to keep the updatedAt field automatically in sync:
    // data.updatedAt = new Date();
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  /**
   * Delete a document by its ID
   * @param id document id
   * @returns deleted document or null
   */
  async delete(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }

  /**
   * Find documents by specific conditions
   * @param filter any valid mongoose filter
   * @returns array of documents matching the condition
   */
  async findByCondition(filter: Partial<Record<keyof T, any>>): Promise<T[]> {
    return this.model.find(filter).exec();
  }

  /**
   * Find a single document by specific conditions
   * @param filter any valid mongoose filter
   * @returns a single document or null
   */
  async findOneByCondition(filter: Partial<Record<keyof T, any>>): Promise<T | null> {
    return this.model.findOne(filter).exec();
  }
}
