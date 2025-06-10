const axios = require('axios');

const http = axios.create({
    baseURL: process.env.BASE_URL || 'https://api.sandbox.midtrans.com',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

module.exports = {
    http
}