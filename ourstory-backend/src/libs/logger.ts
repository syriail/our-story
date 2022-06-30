import * as winston from 'winston'

/**
 * Create a logger instance to write log messages in JSON format.
 *
 * @param tracingId - a tracing id to be added to all log messages
 */
export function createLogger(tracingId: string) {
  return winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    defaultMeta: { ID: tracingId },
    transports: [
      new winston.transports.Console()
    ]
  })
}