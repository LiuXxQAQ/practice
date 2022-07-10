import axios from 'axios'
import cheerio from 'cheerio'
import logger from './logger.js'

const URL = 'https://proxy.seofangfa.com/'

const loadHTML = (content) => {
    const lastUpadteTime = new Date().getTime();
    const props = ['ip', 'port', 'responseTime', 'location', 'lastCheckTime', ];
    try {
        const $ = cheerio.load(content);
        return $('table tbody tr').map((i, el) => {
            const obj = {};
            $(el).children('td').each((index, element) => {
                obj[props[index]] = $(element).text();
            });
            obj['lastUpadteTime'] = lastUpadteTime;
            return obj;
        }).get();

    } catch(error) {
        logger.error(`Fail to parse HTML.${error}`,);
    }
}

export const getProxyIpData = async (url = URL, fn = loadHTML) => {
    try {
        const response = await axios.get(url);
        if(response.status === 200) {
            return fn(response.data);
        }
    } catch(error) {
        logger.error(`Fail to get proxy IP. ${error}`);
    }
}


