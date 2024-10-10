const fs = require('fs-extra');
const path = require("path");
const { Sequelize } = require('sequelize');

// Load environment variables if the .env file exists
if (fs.existsSync('set.env')) {
    require('dotenv').config({ path: __dirname + '/set.env' });
}

const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined ? databasePath : process.env.DATABASE_URL;
module.exports = {
    session: process.env.SESSION_ID || 'FLASH-MD-WA-BOT;;;=>eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiMEZOWDRYeEpiV3NpcjhhZDYxelV6SC9reDU1ODQ1d1Z6VTlUS3JkTndsQT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoic3VOeVQ3c2YyZjFXMDZ4ZFZoRVZON3JiUFphb1Jhb2xrVU0xQmI3WUJCYz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJNUDF3cmJERVByUS9kZzR5V1ZSWmZxODF4V2ZCWnBqUEJhblhYK1RFR1c0PSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJSWXJyKytCSW96cmYxRFhRTnB1Q1JsSDVZVWRmK0wwZm4vSVRueFFRM0NBPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InVGTC9EU2tKZFpoaW9OUGhKam5zV0tuV3FDVnhGVkk0blV4K2ZpcFp0WDA9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImlkWTBFSlZsUWc4V2VyeGxhMTh0eEE1Q09aNUxhM0lubnJSOUM3aUxXbkE9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQUVEWjRTaUdacnp5bmh0ekkwUU4wUnR3aC8vTWUvclEyWkxxWFB5eTBYQT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiMFlQc3Jra3htUmFWZDV2c0s4cll3bnRncmdOT3hCMm51QW9IN09DM2htTT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjVtS0FmL0FSZHBSVVRzVWkxRjI3V0pvQ3E1eVpXM2dZVHJzQ0V3cWlXMnptNmxuMDlVV2l2MHRwSmN4SU14SkVqREJsdnZrUzhwTFl4SzJVMzFaZWlRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTg1LCJhZHZTZWNyZXRLZXkiOiJhUUEwcHZoaHM1VkNHSkdZUnlMdzBZSnhIK2Q0ME9NaGZwM1NyQzErNmRNPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiI5YndLbU9fdVJRcVhOTC10ZnNnTzFnIiwicGhvbmVJZCI6IjFiYzI3NDVmLWQ4M2QtNDVjZS04MjRhLTEwNmVmMWZkZmFhOCIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJHSnhmOE5JcE5oQ0k4UmJpU21vTWo4N2Eyb2s9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiRktqNnJ4dTJBSy9UQy9aQWNTanEvUURvN0t3PSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IkM1VkhFUFg1IiwibWUiOnsiaWQiOiI5NDc1MDE3NzM2OTo4M0BzLndoYXRzYXBwLm5ldCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDTnJuK2VZQkVPbS9uN2dHR0E4Z0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoidU0ycnh2bmFyZWVRNmREZjFadzk3aFJkdEdMZmh0YXVCTFg5WE52T2lHUT0iLCJhY2NvdW50U2lnbmF0dXJlIjoieVhvdDZ2cGJrTFRKUHRSejUxVkRkK2t6RlJSeStHODhpVFQ1MDMzQkVOTkJteXhDcUMvZnVPMVpocmIxai80UmtxcWZUSGZiS2pRREFSallmaFd1Qnc9PSIsImRldmljZVNpZ25hdHVyZSI6IjVDWnljUVdqcE1ZamFFVHcySmQwQWd3ZmtNczI4ZTVyL2dkSGFkRXFRL0V1VTFKMGF2Tk5OckRabmduK1dtaFVJdkM0UXJIMjMxUDdla3JOOHpZTWlnPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiOTQ3NTAxNzczNjk6ODNAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCYmpOcThiNTJxM25rT25RMzlXY1BlNFVYYlJpMzRiV3JnUzEvVnpiem9oayJ9fV0sInBsYXRmb3JtIjoiYW5kcm9pZCIsImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTcyODU2OTMzNSwibXlBcHBTdGF0ZUtleUlkIjoiQUFBQUFCZzAifQ==',
    PREFIXES: (process.env.PREFIX || '.').split(',').map(prefix => prefix.trim()).filter(Boolean),
    OWNER_NAME: process.env.OWNER_NAME || "🍂🖤𝗞𝗜𝗡𝗚 𝗔𝗡𝗝𝗔𝗡𝗔 𝗕𝗕𝗛 💦🥵🍂",
    OWNER_NUMBER: process.env.OWNER_NUMBER || "94760105256",
    AUTO_READ_STATUS: process.env.AUTO_VIEW_STATUS || "on",
    AUTOREAD_MESSAGES: process.env.AUTO_READ_MESSAGES || "on",
    CHATBOT: process.env.CHAT_BOT || "off",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_SAVE_STATUS || 'off',
    A_REACT: process.env.AUTO_REACTION || 'off',
    AUTO_BLOCK: process.env.BLOCK_ALL || 'off',
    URL: process.env.BOT_MENU_LINKS || 'https://static.animecorner.me/2023/08/op2.jpg',
    MODE: process.env.BOT_MODE || "private",
    PM_PERMIT: process.env.PM_PERMIT || 'on',
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME,
    HEROKU_API_KEY: process.env.HEROKU_API_KEY,
    WARN_COUNT: process.env.WARN_COUNT || '3',
    PRESENCE: process.env.PRESENCE || 'online',
    ADM: process.env.ANTI_DELETE || 'on',
    TZ: process.env.TIME_ZONE || 'Africa/Nairobi',
    DP: process.env.STARTING_MESSAGE || "on",
    ANTICALL: process.env.ANTICALL || 'on',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://giftedtech_ke:9BzoUeUQO2owLEsMjz5Vhshva91bxF2X@dpg-crice468ii6s73f1nkt0-a.oregon-postgres.render.com/api_gifted_tech"
        : "postgresql://giftedtech_ke:9BzoUeUQO2owLEsMjz5Vhshva91bxF2X@dpg-crice468ii6s73f1nkt0-a.oregon-postgres.render.com/api_gifted_tech",
    /* new Sequelize({
        dialect: 'sqlite',
        storage: DATABASE_URL,
        logging: false,
    })
    : new Sequelize(DATABASE_URL, {
        dialect: 'postgres',
        ssl: true,
        protocol: 'postgres',
        dialectOptions: {
            native: true,
            ssl: { require: true, rejectUnauthorized: false },
        },
        logging: false,
    }), */
};

// Watch for changes in this file and reload it automatically
const fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`Updated ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
