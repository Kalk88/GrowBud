import axios from 'axios';

const API_URL = 'http://127.0.0.1:4000/';

var API = axios.create({
    baseURL: API_URL,
    timeout: 30000,
});

export default {
    login(loginDetails) {
        return API.post(loginDetails);
    },

    accountRegister(accountDetails){
        
        let query = `query registerUser($accountDetails.username: String, $accountDetails.email: String $accountDetails.password: String) {nae
          registerUser(name: $accountDetails.username, email:$accountDetails.email, password: $accountDetails.password )  
        }`;
        return API.post('/api',
        {
        query, 
        variables: {accountDetails}
        });
    }
}