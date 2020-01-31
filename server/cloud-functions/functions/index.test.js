const test = require('ava')
const f = require('./index.js')

test('reduce multiple schedules on userId', t => {
    const schedules = [
        {
            userId: 'bob',
            plants: [2]
        },
        {
            userId: 'lisa',
            plants: [1]
        },
        {
            userId: 'bob',
            plants: [1]
        },
    ]
    const res = schedules.reduce(f.reduceSchedulesOnUserId, {})
    t.is(2, res.bob.length)
})