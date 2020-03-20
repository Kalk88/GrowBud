/**
 * Wrapper of the loglevel library.
 */

import log from 'loglevel'
log.setDefaultLevel(process.env.LOG_LEVEL ? process.env.LOG_LEVEL as log.LogLevelDesc : 'info')

function trace(...args: any[]): any {
    log.trace('TRACE:', args)
    return args
}

function debug(...args: any[]): any {
    log.debug('DEBUG:', args)
    return args
}

function info(...args: any[]): any {
    log.info('INFO:', args)
    return args
}

function warn(...args: any[]): any {
    log.warn('WARN:', args)
    return args
}

function error(...args: any[]): any {
    log.error('ERROR:', args)
    return args
}

export {
    trace,
    debug,
    info,
    warn,
    error
}