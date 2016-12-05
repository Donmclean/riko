"use strict";
import axios from 'axios';

const mixElement = (state = {}, action) => {
    switch (action.type) {
        case 'GET_MIXES': {
            axios.get('http://localhost:3000/api/v1/mixes')
                .then(function (response) {
                    console.log(response);
                    return response;
                })
                .catch(function (error) {
                    console.log('ERROR: fetching mixes...', error);
                    return state;
                });
            return state;
        }
        default:
            return state;
    }
};

export default mixElement;