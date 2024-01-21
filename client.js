const { default: Axios } = require('axios');
const https = require('https');

const url = 'https://jsonplaceholder.typicode.com\\todos\\1';


const req = https.get(url, res => {
	console.log(`statusCode: ${res.statusCode}`)

	res.on('data', d => {
		// process.stdout.write('\x1b[36m%s\x1b[0m', 'I am cyan')
		console.log('\x1b[36m%s\x1b[0m', d);
	})
})

req.on('error', error => {
	console.error(error)
})

req.end()