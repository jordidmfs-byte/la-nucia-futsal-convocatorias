const https = require('https');

const CLOUD_URL = 'https://extendsclass.com/api/json-storage/bin/cddabda';

module.exports = async (req, res) => {
    // Add CORS headers and disable caching completely
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Cache-Control, Pragma'
    );
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
        const urlObj = new URL(CLOUD_URL);
        const options = {
            hostname: urlObj.hostname,
            port: 443,
            path: `${urlObj.pathname}?_t=${Date.now()}`,
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache'
            }
        };

        https.get(options, (apiRes) => {
            let data = '';
            apiRes.on('data', (chunk) => { data += chunk; });
            apiRes.on('end', () => {
                res.status(apiRes.statusCode).send(data);
            });
        }).on('error', (err) => {
            res.status(500).json({ error: err.message });
        });
    } else if (req.method === 'POST' || req.method === 'PUT') {
        const bodyStr = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
        
        const urlObj = new URL(CLOUD_URL);
        const options = {
            hostname: urlObj.hostname,
            port: 443,
            path: urlObj.pathname,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(bodyStr),
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache'
            }
        };

        const apiReq = https.request(options, (apiRes) => {
            let data = '';
            apiRes.on('data', (chunk) => { data += chunk; });
            apiRes.on('end', () => {
                res.status(apiRes.statusCode).send(data);
            });
        });

        apiReq.on('error', (err) => {
            res.status(500).json({ error: err.message });
        });

        apiReq.write(bodyStr);
        apiReq.end();
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
};
