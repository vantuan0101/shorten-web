/* eslint-disable no-return-await */
import { Model } from 'mongoose';
import { handlePageOptions } from './common/handlePageOptions';

export class BaseRepository<T, K> {
  constructor(private readonly model: Model<K>) {}

  async create(data: any): Promise<any> {
    return await this.model.create(data);
  }

  async findAll(selectOptions?: any, pageOptions?: any) {
    const { limit, skip, sortOptions } = handlePageOptions(pageOptions);
    return await this.model
      .find()
      .limit(limit)
      .skip(skip)
      .sort(sortOptions)
      .select(selectOptions)
      .lean();
  }

  async findAllWithPopulate(
    populateOptions: any,
    selectOptions?: any,
  ): Promise<T[]> {
    return await this.model
      .find()
      .select(selectOptions)
      .populate(populateOptions)
      .lean();
  }

  async findById(id: string, selectOptions?: any) {
    return await this.model.findOne({ id }).select(selectOptions).lean();
  }

  async findOneByOptions(options: any, selectOptions?: any) {
    return await this.model.findOne(options).select(selectOptions).lean();
  }

  async findByIdWithPopulate(
    id: string,
    populateOptions: any,
    selectOptions?: any,
  ) {
    return await this.model
      .findOne({ id })
      .select(selectOptions)
      .populate(populateOptions)
      .lean();
  }

  async updateById(id: string, data: any, selectOptions?: any) {
    return await this.model
      .findOneAndUpdate({ id }, data, { new: true })
      .select(selectOptions)
      .lean();
  }

  async deleteById(id: string) {
    return await this.model.findOneAndDelete({ id }).lean();
  }
}
