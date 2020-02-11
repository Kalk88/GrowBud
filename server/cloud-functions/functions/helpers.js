const retrieveSchedulesEarlierThan = collection => time => collection.where('nextTimeToWater', '<', time).get()
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
  setTokensToUser,
  reduceSchedulesOnUserId
}
