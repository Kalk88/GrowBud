import {
    Credential,
    registerUser
} from './index'

test('Successful user registration.', async () => {
    const cred: Credential = { email: "test@test.com", password: "123pass" }
    const userName = "myUser"
    $res = registerUser(cred, userName);
    expect($res).toBe(false);
});