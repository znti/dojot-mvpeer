module.exports = {

	server: {
		host: 'http://localhost',
		port: 8080,
	},

	dojot: {
		host: 'http://localhost',
		port: 8000,
		resources: {
			auth: '/auth',
			tenants: '/auth/user',
			users: '/auth/user',
			templates: '/template',
			devices: '/device',
		}
	},

	iotAgent: {
		host: 'http://localhost',
		port: 8083,
	},

}
