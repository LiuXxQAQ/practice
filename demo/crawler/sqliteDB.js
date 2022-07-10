import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import sqlite3 from 'sqlite3';
import logger from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DBPATH = 'proxy.db'
const createProxyTableSql = 'CREATE TABLE IF NOT EXISTS proxy(ip VARCHAR, port VARCHAR, location VARCHAR, lastCheckTime VARCHAR, lastUpadteTime INTEGER)';
const insertAllSql = `INSERT INTO proxy(ip, port, location, lastCheckTime, lastUpadteTime) VALUES(?, ?, ?, ?, ?)`;
const deleteAllSql = 'DELETE FROM proxy';
const selectAllSql = 'SELECT * FROM proxy';

let db;

const DB = {
    createTable: () => {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run(createProxyTableSql, (error) => {
                    if (error) reject(error);
                    resolve();
                })
            })
        })
    },
    insertAll: (proxyIpInfoList) => {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                let stmt = db.prepare(insertAllSql);
                for (const info of proxyIpInfoList) {
                    const { ip, port, location, lastCheckTime, lastUpadteTime } = info;
                    stmt.run([ip, port, location, lastCheckTime, lastUpadteTime], (error) => {
                        if (error) reject(error)
                    });
                }
                stmt.finalize();
                resolve();
            });
        });
    },
    deleteAll: () => {
        return new Promise((resolve, reject) => {
            db.run(deleteAllSql, (error) => {
                if (error) reject(error);
                resolve();
            }) 
        });
    },
    queryAll: () => {
        return new Promise((resolve, reject) => {
            db.all(selectAllSql, (error, rows) => {
                if (error) reject(error);
                resolve(rows);
            }) 
        })
    }
}

if (fs.existsSync(path.resolve(__dirname, DBPATH))) {
    db = new sqlite3.Database(DBPATH, (error) => {
        if(error) throw(error);
        logger.info('Database is aready exist, connect it successfully.');
    });
    DB.createTable();
} else {
    db = new sqlite3.Database(DBPATH, (error) => {
        if(error) throw(error);
        logger.info('Create datebase successfully.');
    });
    DB.createTable();
}


export default DB;




