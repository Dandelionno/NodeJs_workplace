'use strict';

const Service = require('egg').Service;

class MysqlService extends Service {
  constructor(ctx) {
    super(ctx);
    this.db = this.app.mysql;
  }

  async insert(tbl_name, columns) {
    tbl_name = await this.table_name(tbl_name);
    this.db.insert(tbl_name, columns);
  }

  async update(tbl_name, columns, whereCond) {
    const options = {
      where: whereCond,
    };
    tbl_name = await this.table_name(tbl_name);
    const result = await this.db.update(tbl_name, columns, options);
    return result;
  }

  async select(tbl_name, options) {
    tbl_name = await this.table_name(tbl_name);

    // options示例
    // const options = {
    //     where: { status: 'draft', author: ['author1', 'author2'] },
    //     columns: ['author', 'title'],
    //     orders: [['created_at','desc'], ['id','desc']],
    //     limit: 10, 
    //     offset: 0, 
    // }

    const results = await this.db.select(tbl_name, options);
    return results;
  }

  async delete(tbl_name, where) {
    tbl_name = await this.table_name(tbl_name);
    const result = await this.db.delete(tbl_name, where);
    return result;
  }

  async query(sql) {
    const result = await this.db.query(sql);
    return result;
  }

  async table_name(tbl_name) {
    if (this.config.mysql.client.tbl_prefix) {
      tbl_name = this.config.mysql.client.tbl_prefix + tbl_name;
    }
    return tbl_name;
  }

  // 开始化事务
  async beginTransaction() {
    this.db = await this.app.mysql.beginTransaction();
  }

  // 提交事务
  async commit() {
    await this.db.commit();
    this.db = this.app.mysql;// 提交事务后变回普通模式
  }

  // 事务回滚
  async rollback() {
    await this.db.rollback();
  }

  // sql表达式（相当于yii里面的Express）
  literal(express) {
    const Literal = this.app.mysql.literals.Literal;
    return new Literal(express);
  }
}

module.exports = MysqlService;
