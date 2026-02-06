import CryptoJS from 'crypto-js';

/**
 * SwitchBot API V1.1 署名生成とデータ取得
 */
const TOKEN = import.meta.env.VITE_SWITCHBOT_TOKEN;
const SECRET = import.meta.env.VITE_SWITCHBOT_SECRET;
const DEVICE_ID = import.meta.env.VITE_DEVICE_ID;

export async function fetchSensorData() {
    if (!TOKEN || !SECRET || !DEVICE_ID) {
        console.error("SwitchBot: Missing credentials in .env");
        return { temp: "--", humidity: "--" };
    }

    const t = Date.now();
    const nonce = CryptoJS.lib.WordArray.random(16).toString();
    const data = TOKEN + t + nonce;
    const sign = CryptoJS.HmacSHA256(data, SECRET).toString(CryptoJS.enc.Base64);

    try {
        const response = await fetch(`https://api.switch-bot.com/v1.1/devices/${DEVICE_ID}/status`, {
            headers: {
                "Authorization": TOKEN,
                "sign": sign,
                "nonce": nonce,
                "t": t.toString(),
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();

        if (result.statusCode === 100) {
            return {
                temp: result.body.temperature || "--",
                humidity: result.body.humidity || "--"
            };
        } else {
            console.error("SwitchBot API Error:", result.message);
            return { temp: "--", humidity: "--" };
        }
    } catch (error) {
        console.error("SwitchBot Fetch Error:", error);
        return { temp: "--", humidity: "--" };
    }
}