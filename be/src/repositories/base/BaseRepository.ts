// 기본 Repository 클래스 - 완벽한 모듈화
import { Model, ModelCtor, WhereOptions, FindOptions, Transaction, Op } from 'sequelize';
import { getSequelize } from '../../config/database';
import { logger } from '../../config/logger';

export abstract class BaseRepository<T extends Model> {
  protected model: ModelCtor<T>;
  protected modelName: string;

  constructor(model: ModelCtor<T>, modelName: string) {
    this.model = model;
    this.modelName = modelName;
  }

  // 기본 CRUD 메서드들
  async findById(id: number, transaction?: Transaction): Promise<T | null> {
    try {
      const result = await this.model.findByPk(id, { transaction });
      return result;
    } catch (error) {
      logger.error(`${this.modelName} findById 오류`, { id, error });
      throw error;
    }
  }

  async findAll(options?: FindOptions, transaction?: Transaction): Promise<T[]> {
    try {
      const results = await this.model.findAll({ ...options, transaction });
      return results;
    } catch (error) {
      logger.error(`${this.modelName} findAll 오류`, { options, error });
      throw error;
    }
  }

  async findOne(options: FindOptions, transaction?: Transaction): Promise<T | null> {
    try {
      const result = await this.model.findOne({ ...options, transaction });
      return result;
    } catch (error) {
      logger.error(`${this.modelName} findOne 오류`, { options, error });
      throw error;
    }
  }

  async count(options?: WhereOptions, transaction?: Transaction): Promise<number> {
    try {
      const count = await this.model.count({ where: options, transaction });
      return count;
    } catch (error) {
      logger.error(`${this.modelName} count 오류`, { options, error });
      throw error;
    }
  }

  async create(data: any, transaction?: Transaction): Promise<T> {
    try {
      const result = await this.model.create(data, { transaction });
      return result;
    } catch (error) {
      logger.error(`${this.modelName} create 오류`, { data, error });
      throw error;
    }
  }

  async update(id: number, data: any, transaction?: Transaction): Promise<[number, T[]]> {
    try {
      const result = await this.model.update(data, {
        where: { id } as any,
        returning: true,
        transaction,
      });
      return result;
    } catch (error) {
      logger.error(`${this.modelName} update 오류`, { id, data, error });
      throw error;
    }
  }

  async delete(id: number, transaction?: Transaction): Promise<number> {
    try {
      const result = await this.model.destroy({
        where: { id } as any,
        transaction,
      });
      return result;
    } catch (error) {
      logger.error(`${this.modelName} delete 오류`, { id, error });
      throw error;
    }
  }

  // 페이지네이션 메서드
  async findWithPagination(options: {
    where?: WhereOptions;
    page: number;
    pageSize: number;
    order?: [string, string][];
    attributes?: string[];
    include?: any[];
    transaction?: Transaction;
  }): Promise<{ data: T[]; totalItems: number }> {
    try {
      const { where, page, pageSize, order, attributes, include, transaction } = options;
      const offset = page * pageSize;

      const [data, totalItems] = await Promise.all([
        this.model.findAll({
          where,
          limit: pageSize,
          offset,
          order,
          attributes,
          include,
          transaction,
        }),
        this.model.count({ where, transaction }),
      ]);

      return { data, totalItems };
    } catch (error) {
      logger.error(`${this.modelName} findWithPagination 오류`, { options, error });
      throw error;
    }
  }

  // 검색 메서드
  async search(options: {
    searchQuery?: string;
    searchFields: string[];
    where?: WhereOptions;
    page: number;
    pageSize: number;
    order?: [string, string][];
    attributes?: string[];
    include?: any[];
    transaction?: Transaction;
  }): Promise<{ data: T[]; totalItems: number }> {
    try {
      const { searchQuery, searchFields, where, page, pageSize, order, attributes, include, transaction } = options;
      const offset = page * pageSize;

      let searchWhere = where || {};

      if (searchQuery && searchFields.length > 0) {
        const searchConditions = searchFields.map(field => ({
          [field]: {
            [Op.iLike]: `%${searchQuery}%`,
          },
        }));

        searchWhere = {
          ...searchWhere,
          [Op.or]: searchConditions,
        };
      }

      const [data, totalItems] = await Promise.all([
        this.model.findAll({
          where: searchWhere,
          limit: pageSize,
          offset,
          order,
          attributes,
          include,
          transaction,
        }),
        this.model.count({ where: searchWhere, transaction }),
      ]);

      return { data, totalItems };
    } catch (error) {
      logger.error(`${this.modelName} search 오류`, { options, error });
      throw error;
    }
  }

  // 집계 메서드
  async aggregate(options: {
    where?: WhereOptions;
    groupBy: string[];
    attributes: any[];
    transaction?: Transaction;
  }): Promise<T[]> {
    try {
      const { where, groupBy, attributes, transaction } = options;

      const results = await this.model.findAll({
        where,
        attributes,
        group: groupBy,
        transaction,
      });

      return results;
    } catch (error) {
      logger.error(`${this.modelName} aggregate 오류`, { options, error });
      throw error;
    }
  }

  // 트랜잭션 헬퍼
  async withTransaction<T>(callback: (transaction: Transaction) => Promise<T>): Promise<T> {
    const transaction = await getSequelize().transaction();
    try {
      const result = await callback(transaction);
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
