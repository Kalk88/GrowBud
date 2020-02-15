/**
 *  Retrieves watering schedules from firebase.
 * @param {*} collection A firebase collection
 * @param time a javascript timestamp as string
 * @returns {object} map of schedules structured on userId
 */
const retrieveSchedulesEarlierThan = collection => time => collection
  .where('nextTimeToWater', '<', time)
  .get()
  .then(snapshot => {
    console.log(`Found ${snapshot.docs.length} schedules to update`)
    return snapshot.docs
      .map(doc => ({
        id: doc.id,
        schedule: doc.data()
      }))
      .reduce(reduceSchedulesOnUserId, {})
  }).catch(error => {
    logError(error)
    return {}
  })

/**
 *  Retrieves a device tokens from firebase.
 * @param {*} collection A firebase collection
 * @param time a javascript timestamp as string
 * @returns {array} device tokens for the given user id
 */
const retrieveDeviceTokens = collection => userId => collection
  .doc(userId)
  .get()
  .then(tokens => {
    if (tokens.exists) {
      return tokens.data()
    }
    return []
  })
  .catch(error => {
    logError(error)
    return []
  })

/**
 * Update a schedule in firebase on the given id.
 * @param {*} collection a firebase collection
 * @param {*} scheduleId id of the document to update
 * @param {*} schedule the schedule to update
 * @returns tuple [status, object]
 */
const setSchedule = collection => scheduleId => schedule => collection
  .doc(scheduleId)
  .set(schedule)
  .then(status => [OK, {}])
  .catch(error => {
    logError(error)
    return [ERROR, error]
  })

/**
 * Takes an schedule and updates the next time to water with the schedule interval
 * returns a new schedule object.
 * @param {object} schedule
 * @returns a new schedule object
 */
const setNextTimeToWater = schedule => ({
  ...schedule,
  nextTimeToWater: (parseInt(schedule.nextTimeToWater) + (84600000 * schedule.interval)).toString()
})

const setTokensToUser = userId => data => tokens => ({
  [userId]: {
    ...data,
    tokens
  }
})

const reduceSchedulesOnUserId = (accumulator, current) => {
  if (accumulator[current.schedule.userId]) {
    accumulator[current.schedule.userId].schedules.push(current)
    return accumulator
  }
  return {
    ...accumulator,
    [current.schedule.userId]: {
      schedules: [current]
    }
  }
}

const OK = 'OK'
const ERROR = 'ERROR'
const logError = error => console.log(JSON.stringify(error))

module.exports = {
  retrieveSchedulesEarlierThan,
  retrieveDeviceTokens,
  setSchedule,
  setNextTimeToWater,
  setTokensToUser
}
