import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
// import axios from 'axios';
import cheerio from 'cheerio';
import logger from './logger.js';
import DB from './sqliteDB.js';
import { getProxyIpData } from './proxy.js';
import got from 'got';
import { HttpsProxyAgent } from 'hpagent';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl = 'https://wallhaven.cc/search?q=jinx&page=2';
const targetDir = 'images';
const INTERVAl = 1 * 60 * 60 * 1000;

let success = 0;

const useragents = [
    `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36`
] 

const getImages = async (ipInfoList) => {
    const imageList = [];
    const { ip, port } = getRandomArrayItem(ipInfoList);
    const useragent = getRandomArrayItem(useragents);
    const headers = {
        'User-Agent': useragent,
    }
    const agent = new HttpsProxyAgent({
        keepAlive: true,
        keepAliveMsecs: 1000,
        maxSockets: 256,
        maxFreeSockets: 256,
        proxy: `http://${ip}:${port}`
    });

    try {
        const response = await got(
            baseUrl,
            {
                agent: {
                    https: agent
                },
                headers: headers
            }
        ).json();
        console.log(response);
        if (response && response.data) {
            const html = response.data;
            try {
                const $ = cheerio.load(html);
                $('.thumb-listing-page ul li img').each((i, el) => {
                    el && imageList.push(el.attribs['data-src'])
                })
            } catch(e) {
                logger.error(`Fail to get the path of images. Please check the selector or address.`);
            }
            logger.info(`Scanning ${imageList.length} images ...`)
            return imageList;
        }
    } catch(err) {
        console.log(err);
        logger.error(`Fail to get URL of images. Please check the selector or address.`);
    }
}

const checkExpired = (rows) => {
    if (rows && rows.length) {
        const lastUpadteTime = rows[0]['lastUpadteTime'];
        const currentTime = new Date().getTime();
        return currentTime - lastUpadteTime > INTERVAl
    }
    return true;
}

const getIpInfoList = async () => {
    const rows = await DB.queryAll();
    const needToUpdate = checkExpired(rows);
    if (needToUpdate) {
        const data = await getProxyIpData();
        DB.deleteAll().then(() => DB.insertAll(data));
        return data;
    } 
    return rows;
}

const getRandomArrayItem = (arr) => {
    if (!arr.length) return {}; 
    const min = 0;
    const max = arr.length - 1
    const random =  Math.round(Math.random() * (max - min)) + min;
    return arr[random];
}

const run = async () => {
    const ipInfoList = await getIpInfoList();
    console.log(ipInfoList);
    const imageList = await getImages(ipInfoList);
    await downLoadImage(imageList, ipInfoList, () => { success++; });
    getSummaries(imageList);
};  

const downLoadImage = async (urlList, ipInfoList, callback) => {
    if (!urlList.length) return;
    const { ip, port } = getRandomArrayItem(ipInfoList);
    const useragent = getRandomArrayItem(useragents);
    const headers = {
        'User-Agent': useragent,
    }
    const httpsAgent = new HttpsProxyAgent(`http://${ip}:${port}`);

    logger.info(`Ready to download ${urlList.length} images ...`)
        for (let i = 0, len = urlList.length; i < len; i++) {
            const url = urlList[i];
            try {
                const response = await axios.get(url, { responseType: 'arraybuffer' }, { httpsAgent: httpsAgent, httpAgent: httpsAgent,  headers: headers });
                response && response.data &&  writeImageToDir(url, response.data, callback);
            } catch(err) {
                logger.error(`Fail to download image: ${url} ERROR: ${err}`);
            }
        }
}

const writeImageToDir = (url, data, callback) => {
    const targetPath = path.resolve(__dirname, `./${targetDir}/${url.split('/').pop()}`)
    !fs.existsSync(targetDir) && fs.mkdirSync(targetDir);
    if (fs.existsSync(targetPath)) {
        callback && callback();
        return;
    }
    fs.writeFile(targetPath, data, (err) => {
        if (err) {
            logger.error(`Fail to save image: ${url} ERROR: ${err}`);
            return; 
        }
        callback && callback();
    })
}

const getSummaries = (imageList) => {
    const total = imageList.length;
    const failed = total - success;
    logger.info('');
    logger.info('DownLoad Summaries');
    logger.info('');
    logger.info(`Total: ${total}  Success: ${success}  Failed: ${failed}`)
    process.exit();
}

run();

