const test = require('ava')
const { retrieveDeviceTokens, retrieveSchedulesEarlierThan, setSchedule, setTokensToUser, reduceSchedulesOnUserId } = require('./helpers')

const resolvePromise = (arg) => new Promise((resolve, reject) => resolve(arg))
const rejectPromise = (arg) => new Promise((resolve, reject) => reject(arg))

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
  const res = schedules.reduce(reduceSchedulesOnUserId, {})
  t.is(2, res.bob.schedules.length)
})

test('retrieveDeviceTokens when devices exists', t => {
  const devices = [
    {
      deviceToken: '123sometoken',
      deviceName: 'bobs brave browser',
      createdAt: 'some date'
    }
  ]
  const collection = {
    data: {
      bob: {
        exists: true,
        data: () => devices
      }
    },
    id: '',
    doc: (id) => {
      this.id = id
      return collection
    },
    get: () => resolvePromise(collection.data[this.id])
  }

  return retrieveDeviceTokens(collection)('bob').then(result => t.deepEqual(devices, result))
})
