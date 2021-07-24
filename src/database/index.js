import knex from 'knex';
import { Model } from 'objection';
import visibility from 'objection-visibility';
import config from '../config';

export const conn = knex({
  client: 'mysql',
  connection: config.MYSQL_CONNECTION,
});

export class BaseModel extends visibility(Model) {
  static get modifiers() {
    return {
      notDeleted(builder) {
        builder.whereNull('deleted_at');
      },
    };
  }
}

BaseModel.knex(conn);
