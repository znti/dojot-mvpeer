module.exports = {

	server: {
		port: 8080,
	},

	dojot: {
		server: 'http://localhost:8000',
		auth: '/auth',
		tenants: '/auth/user',
		users: '/auth/user',
		templates: '/template',
		devices: '/device',
	},

	ping: () => {
		console.log('OMG');
	},

}
