const http = require('http')
const qs = require('querystring')
var users = []
const server = http.createServer((req, res) => {
	console.log('request received')
	if (req.method == 'POST') {
		var allData = ''
		req.on('data', data => {
			allData += data
		})
		req.on('end', () => {
			var body
			try {
				body = JSON.parse(allData)
			} catch {
				body = {}
			}
			switch (req.url) {
				case '/register':
					console.log(body)
					console.log(body.username)
					console.log(body.password)
					if (!body.username || !body.password) {
						res.end(JSON.stringify({ msg: 'empty_data' }))
						break
					}
					let user = users.find(user => user.username == body.username)
					if (user) {
						res.end(JSON.stringify({ msg: 'user_exists' }))
						break
					}
					users.push({ username: body.username, password: body.password })
					res.end(JSON.stringify({ msg: 'ok' }))
					break
				case '/get':
					res.end(JSON.stringify({ msg: 'ok', users: users }))
					break
				case '/delete':
					let i = users.findIndex(user => user.username == body.username)
					if (i == -1) {
						res.end(JSON.stringify({ msg: 'user does not exist' }))
						break
					}
					users.splice(i, 1)
					res.end(JSON.stringify({ msg: 'ok', users: users }))
					break
				default:
					res.end(JSON.stringify({ msg: 'invalid_url', data: body }))
			}
		})
	}
})

const port = 3000
server.listen(port)
console.log(`Running on port: ${port}`)
