const test = require('ava')
const {
  retrieveDeviceTokens,
  retrieveSchedulesEarlierThan,
  setSchedule,
  setTokensToUser,
  setNextTimeToWater
} = require('./helpers')

const resolvePromise = (arg) => new Promise((resolve, reject) => resolve(arg))
const rejectPromise = (arg) => new Promise((resolve, reject) => reject(arg))

test('retrieveSchedulesEarlierThan returns an empty object when no schedules exists', t => {
  const collection = {
    snapshot: [],
    where: (operand, predicate, value) => collection,
    get: () => resolvePromise(collection.snapshot)
  }
  return retrieveSchedulesEarlierThan(collection)('some date').then(res => t.deepEqual({}, res))
})

test('retrieveSchedulesEarlierThan returns an empty object on rejection', t => {
  const collection = {
    snapshot: [],
    where: (operand, predicate, value) => collection,
    get: () => rejectPromise(collection.snapshot)
  }
  return retrieveSchedulesEarlierThan(collection)('some date').then(res => t.deepEqual({}, res))
})

test('retrieveSchedulesEarlierThan returns an object with schedules object on resolve', t => {
  const schedules = [
    {
      id: 'asd',
      data: () => ({
        interval: 1,
        nextTimeToWater: '123',
        userId: 'bob',
        plants: [2]
      })
    },
    {
      id: 'dd',
      data: () => ({
        interval: 1,
        nextTimeToWater: '123',
        userId: 'lisa',
        plants: [1]
      })
    },
    {
      id: 'xx',
      data: () => ({
        interval: 1,
        nextTimeToWater: '123',
        userId: 'bob',
        plants: [1]
      })
    }
  ]
  const collection = {
    snapshot: {
      docs: schedules
    },
    where: (operand, predicate, value) => collection,
    get: () => resolvePromise(collection.snapshot)
  }
  return retrieveSchedulesEarlierThan(collection)('some date')
    .then(res => t.deepEqual({
      bob: {
        schedules: [{
          id: 'asd',
          schedule: {
            interval: 1,
            nextTimeToWater: '123',
            userId: 'bob',
            plants: [2]
          }
        },
        {
          id: 'xx',
          schedule: {
            interval: 1,
            nextTimeToWater: '123',
            userId: 'bob',
            plants: [1]
          }
        }
        ]
      },
      lisa: {
        schedules: [
          {
            id: 'dd',
            schedule: {
              interval: 1,
              nextTimeToWater: '123',
              userId: 'lisa',
              plants: [1]
            }
          }
        ]
      }
    },
    res))
})

test('retrieveDeviceTokens returns an array of devices tokens when devices exists', t => {
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

test('retrieveDeviceTokens returns an empty array when devices does not exists', t => {
  const collection = {
    data: {
      bob: {
        exists: false,
        data: () => []
      }
    },
    id: '',
    doc: (id) => {
      this.id = id
      return collection
    },
    get: () => resolvePromise(collection.data[this.id])
  }

  return retrieveDeviceTokens(collection)('bob').then(result => t.deepEqual(result, []))
})

test('retrieveDeviceTokens returns an empty array when collection.get rejects', t => {
  const collection = {
    data: { },
    id: '',
    doc: (id) => {
      this.id = id
      return collection
    },
    get: () => rejectPromise('error')
  }

  return retrieveDeviceTokens(collection)('bob').then(result => t.deepEqual(result, []))
})

test('setsSchedule returns OK on successful update', t => {
  const collection = {
    id: '',
    doc: (id) => {
      this.id = id
      return collection
    },
    set: (item) => resolvePromise({})
  }
  const res = setSchedule(collection, 1, {})
  console.log(res)
  t.deepEqual(['OK', {}], res)
})

test('setSchedule returns ERROR on unsuccessful update', t => {
  const collection = {
    id: '',
    doc: (id) => {
      this.id = id
      return collection
    },
    set: (item) => rejectPromise('set schedule error')
  }
  t.deepEqual(['ERROR', {}], setSchedule(collection, 1, {}))
})

test('setNextTimeToWater returns a new schedule', t => {
  const schedule = {
    interval: 1,
    nextTimeToWater: '1581758072750',
    userId: 'lisa',
    plants: [1]
  }
  const newSchedule = setNextTimeToWater(schedule)
  t.deepEqual(schedule, schedule)
  t.deepEqual(newSchedule, {
    ...schedule,
    nextTimeToWater: '1581842672750'
  })
})
