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
  t.is(2, res.bob.length)
})

test('a', t => {
  const res = new Promise((resolve, reject) => resolve(
    {
      a: 'b',
      c: 'd'
    }))
  return res.then(o => {
    return new Promise((resolve, reject) => {
      resolve(Object.entries(o)
        .map(([k, v]) => {
          console.log(k, v)
          return {
            [k]: { [v]: [] }
          }
        })
      )
    })
  })
    .then(result => {
      console.log(result)
      const expected = [
        {
          a: {
            b: []
          }
        }, {
          c: {
            d: []
          }
        }
      ]
      t.deepEqual(result, expected)
    })
})
