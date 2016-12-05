import Auth0 from 'auth0-js';

export default class AuthService {
    constructor(clientId, domain) {

        this.auth0 = new Auth0({
            clientID: clientId,
            domain: domain,
            responseType: 'token'
        });

        this.login = this.login.bind(this);
        this.signup = this.signup.bind(this);
    }

    login(params, onError){
        //redirects the call to auth0 instance
        this.auth0.login(params, onError);
    }

    signup(params, onError){
        //redirects the call to auth0 instance
        this.auth0.signup(params, onError);
    }

    changePassword(params, onError){
        //redirects the call to auth0 instance
        this.auth0.changePassword(params, onError);
    }

    loggedIn(){
        // Checks if there is a saved token and it's still valid
        const token = this.getToken();
        return !!token && !this.isTokenExpired(token);
    }

    tempLoggedIn() {
        return localStorage.getItem('LafloiTempPass');
    }

    setToken(idToken){
        // Saves user token to localStorage
        localStorage.setItem('id_token', idToken);
    }

    getToken(){
        // Retrieves the user token from localStorage
        return localStorage.getItem('id_token');
    }

    getTokenExpirationDate (token) {
        const decoded = this.auth0.decodeJwt(token);
        if(!decoded.exp) {
            return null;
        }

        const date = new Date(0); // The 0 here is the key, which sets the date to the epoch
        date.setUTCSeconds(decoded.exp);
        return date;
    }

    isTokenExpired(token) {
        const date = this.getTokenExpirationDate(token);
        const offsetSeconds = 0;
        if (date === null) {
            return false;
        }
        return !(date.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)));
    }

    logout(){
        // Clear user token and profile data from localStorage
        localStorage.removeItem('id_token');
    }

    TempLogout() {
        localStorage.removeItem('LafloiTempPass');
    }

    getUserProfile(callback) {
        const token = this.getToken();
        return this.auth0.getProfile(token, (err, users) => {
            if(err) {
                console.error('ERROR > fetching users...', err);
                callback(new Error('ERROR > fetching users...', err));
            }
            callback(null, users);
        });
    }
}