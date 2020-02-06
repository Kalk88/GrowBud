const test = require('ava')
const f = require('./index.js')

test('reduce multiple schedules on userId', t => {
  const schedules = [
    {
      id: 'asd',
      schedule: {
        userId: 'bob',
        plants: [2]
      }
    },
    {
      id: 'dd',
      schedule: {
        userId: 'lisa',
        plants: [1]
      }
    },
    {
      id: 'xx',
      schedule: {
        userId: 'bob',
        plants: [1]
      }
    }
  ]
  const res = schedules.reduce(f.reduceSchedulesOnUserId, {})
  t.is(2, res.bob.schedules.length)
})
