exports.logger = (message, error) => {
	console.error(`[${new Date().toISOString()}]: ${message}`, error);
};
