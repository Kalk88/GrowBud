const test = require('ava')
const { doWork } = require('./index')
const resolvePromise = (arg) => new Promise((resolve, reject) => resolve(arg))
const rejectPromise = (arg) => new Promise((resolve, reject) => reject(arg))
const earlier = (Date.now() - 360000).toString(10)
const schedules = [
  {
    id: 'id1',
    data: () => ({
      interval: 1,
      nextTimeToWater: earlier,
      userId: 'bob',
      plants: ['potato']
    })
  },
  {
    id: 'id2',
    data: () => ({
      interval: 1,
      nextTimeToWater: earlier,
      userId: 'lisa',
      plants: ['cucumber']
    })
  },
  {
    id: 'id3',
    data: () => ({
      interval: 1,
      nextTimeToWater: earlier,
      userId: 'bob',
      plants: ['tomato']
    })
  }
]
const schedulesCollection = {
  snapshot: { docs: schedules },
  data: {
  },
  doc: (id) => schedulesCollection,
  where: (operand, predicate, value) => schedulesCollection,
  get: () => resolvePromise(schedulesCollection.snapshot),
  set: (item) => resolvePromise({})
}

const pushCollection = {
  snapshot: { docs: [] },
  data: {
  },
  doc: (id) => pushCollection,
  where: (operand, predicate, value) => pushCollection,
  get: () => resolvePromise(pushCollection.snapshot),
  set: (item) => resolvePromise({})
}

test('doWork', t => {
  console.log(doWork)
  return doWork(schedulesCollection, pushCollection).then(res => {
    console.log('do work', res)
    t.pass()
  })
})
