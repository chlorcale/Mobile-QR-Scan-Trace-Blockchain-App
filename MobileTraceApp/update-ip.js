const fs = require('fs');
const os = require('os');

function getIP() {
    const interfaces = os.networkInterfaces();
    let backupIP = 'localhost';

    for (const devName in interfaces) {
        const iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            const alias = iface[i];
            if (alias.family === 'IPv4' && !alias.internal) {
                // Ưu tiên dải IP Wi-Fi phổ biến (192.168.x.x)
                if (alias.address.startsWith('192.168.')) {
                    return alias.address;
                }
                backupIP = alias.address;
            }
        }
    }
    return backupIP;
}

const currentIP = getIP();
const content = `export const BASE_URL = 'http://${currentIP}:5000/api';`;

fs.writeFileSync('./src/ip-config.js', content);
console.log('✅ Đã cập nhật IP chuẩn Wi-Fi cho Mobile: ' + currentIP);