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
    console.log(error)
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
    console.error(error)
    return []
  })
const setSchedule = collection => scheduleId => schedule => collection.doc(scheduleId).set(schedule)
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

module.exports = {
  retrieveSchedulesEarlierThan,
  retrieveDeviceTokens,
  setSchedule,
  setTokensToUser
}
