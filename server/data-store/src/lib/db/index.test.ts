import test from 'ava'
import * as firebase from '@firebase/testing'
import * as fs from 'fs'
import { getWateringSchedulesForUser } from './index'

/*
 * ============
 *    Setup
 * ============
 */
const projectId = 'firestore-emulator-example'
const coverageUrl = `http://localhost:8080/emulator/v1/projects/${projectId}:ruleCoverage.html`;

const rules = fs.readFileSync('/home/kalk/repos/GrowBud/server/data-store/firestore.rules', 'utf8');

const authedApp = auth => firebase
    .initializeTestApp({ projectId, auth })
    .firestore()

test.before(async _t => {
    await firebase.loadFirestoreRules({ projectId, rules })
})
test.beforeEach(async _t => {
    // Clear the database between tests
    await firebase.clearFirestoreData({ projectId })
});

test.after(async _t => {
    await Promise.all(firebase.apps().map(app => app.delete()));
    console.log(`View rule coverage information at ${coverageUrl}\n`);
});


test('get Schedules for user', async t => {
    t.plan(1)
    const uid = "bob"
    const db = authedApp({ uid })
    const schedule =
    {
        userId: 'bob',
        plants: [{
            name: 'bobs plant'
        }],
        nextTimeToWater: '1578508507',
        interval: 1
    }
    await db.collection('wateringSchedules')
        .doc(uid)
        .set(schedule)

    const schedules = await getWateringSchedulesForUser(uid, null, 0)
    console.log(schedules)
    t.assert(schedules[0].id === uid)
})