'use strict';

const Service = require('egg').Service;

class MysqlService extends Service {
  async insert(tbl_name, columns) {
    tbl_name = await this.table_name(tbl_name);
    this.app.mysql.insert(tbl_name, columns);
  }

  async update(tbl_name, columns, whereCond) {
    const options = {
      where: whereCond,
    };
    console.log(options, columns);
    tbl_name = await this.table_name(tbl_name);
    const result = await this.app.mysql.update(tbl_name, columns, options);
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

    const results = await this.app.mysql.select(tbl_name, options);
    return results;
  }

  async delete(tbl_name, where) {
    tbl_name = await this.table_name(tbl_name);
    const result = await this.app.mysql.delete(tbl_name, where);
    return result;
  }

  async query(sql) {
    console.log(this.is_transaction);
    const result = await this.app.mysql.query(sql);
    return result;
  }

  async table_name(tbl_name) {
    if (this.config.mysql.client.tbl_prefix) {
      tbl_name = this.config.mysql.client.tbl_prefix + tbl_name;
    }
    return tbl_name;
  }
}

MysqlService.is_transaction = false;

module.exports = MysqlService;
