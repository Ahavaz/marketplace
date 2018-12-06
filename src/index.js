const server = require('./server')

server.listen(3000 || process.env.PORT, () => console.log('Server started...'))
