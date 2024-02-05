import {OneSchema, Table} from 'dynamodb-onetable';
import {
  DynamoDBRepository,
  DynamoDBRepositoryConfig,
} from '@nr1e/dynamodb-support';

export interface EntityParameters {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

function toEntityParameters<T>(data: T): EntityParameters {
  return {
    Detail: data,
  };
}

export interface OneTableRepositoryConfig<T> extends DynamoDBRepositoryConfig {
  schema: OneSchema;
  modelName: string;
  entityParametersFn?: (data: T) => EntityParameters;
}

export abstract class OneTableRepository<T> extends DynamoDBRepository {
  protected table: Table;
  protected model;
  protected entityParametersFn: (data: T) => EntityParameters;
  protected constructor(config: OneTableRepositoryConfig<T>) {
    super(config);
    this.entityParametersFn = config.entityParametersFn ?? toEntityParameters;
    this.table = new Table({
      client: this.client,
      name: this.tableName,
      schema: config.schema,
      partial: false,
    });
    this.model = this.table.getModel(config.modelName);
  }

  async save(data: T, overwrite?: boolean): Promise<void> {
    if (overwrite) {
      await this.model.upsert(toEntityParameters(data));
    } else {
      await this.model.create(toEntityParameters(data));
    }
  }

  async update(data: T): Promise<void> {
    await this.model.update(toEntityParameters(data));
  }

  async delete(id: string): Promise<void> {
    await this.model.remove({
      Detail: {
        id,
      },
    });
  }
}
