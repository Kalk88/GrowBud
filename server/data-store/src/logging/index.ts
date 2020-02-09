/**
 * Wrapper of the loglevel library.
 */

import log from 'loglevel'
log.setDefaultLevel(process.env.LOG_LEVEL ? process.env.LOG_LEVEL as log.LogLevelDesc : 'info')

function trace(...args: any[]): void {
    log.trace('TRACE:', args)
}

function debug(...args: any[]): void {
    log.debug('DEBUG:', args)
}

function info(...args: any[]): void {
    log.info('INFO:', args)
}

function warn(...args: any[]): void {
    log.warn('WARN:', args)
}

function error(...args: any[]): void {
    log.error('ERROR:', args)
}

export {
    trace,
    debug,
    info,
    warn,
    error
}