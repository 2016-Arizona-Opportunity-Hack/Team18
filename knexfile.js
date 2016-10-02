'use strict';

const secConfig = require('./bin/secret_settings');
const dbConfig = secConfig.db_config;

module.exports = {
	client: 'pg',
	connection: {
		database: dbConfig.database,
		user: dbConfig.user,
		password: dbConfig.password,
		host: dbConfig.host,
		ssl: secConfig.pg_ssl
	},
	pool: {
		min: 1,
		max: 4
	},
	migrations: {
		directory: './migrations',
		tableName: 'migrations'
	},
	seeds: {
		directory: './seeds/development'
	}
};
