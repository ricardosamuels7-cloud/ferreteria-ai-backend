"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
const config_1 = require("./config");
exports.pool = new pg_1.Pool({
    host: config_1.config.pg.host,
    port: config_1.config.pg.port,
    database: config_1.config.pg.database,
    user: config_1.config.pg.user,
    password: config_1.config.pg.password
});
