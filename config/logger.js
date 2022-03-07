const {createLogger, transports, format} = require('winston');

const loggerFormat = format.combine(format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}), format.printf((log) => {
    return `${log.timestamp} [${log.level.toUpperCase()}] ${log.message}`;
}));

module.exports = logger = createLogger({
    format: loggerFormat,
    transports: [
        new transports.File({filename: 'todo.log'}),
        new transports.Console()
    ]
});