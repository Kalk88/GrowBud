/*
import {
    Credential,
    registerUser
} from './index'
*/
import test from 'ava';

const fn = () => 'foo';

test('fn() returns foo', t => {
    t.is(fn(), 'foo');
});
/*
test('Successful user registration.', async () => {
    //const cred: Credential = { email: "test@test.com", password: "123pass" }
    //const userName = "myUser"
    //const res = registerUser(cred, userName);
});
*/