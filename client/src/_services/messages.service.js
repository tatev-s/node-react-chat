import {authHeader} from "../_helpers";
import {userService} from "./index";
export const messagesService = {
    history,
    publish
};

function history() {
    const requestOptions = {
        method: 'GET',
        headers:  authHeader(),
    }; 
    return fetch(`${process.env.REACT_APP_API_URL}/messages`, requestOptions)
        .then(handleResponse)
        .then(data => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            console.log('data',data)
            return data;
        });
}

function publish(data){
    const requestOptions = {
        method: 'POST',
        headers:  authHeader(),
        body: JSON.stringify(data)
    }; 
    return fetch(`${process.env.REACT_APP_API_URL}/publish`, requestOptions)
        .then(handleResponse)
        .then(data => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            console.log('data',data)
            return data;
        });
}


function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        console.log('data',data)
        if (!data.success) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                userService.logout();
                window.location.reload(true);
            }
            const error = data.err;
            return Promise.reject(error);
        }

        return data.success;
    });
}