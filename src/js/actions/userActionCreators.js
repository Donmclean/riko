"use strict";
export const setUserProfile = (user) => ({
    type: 'GET_USER_PROFILE',
    user
});

export const fetchUserProfile = (auth) => {
    // return (dispatch) => auth.getUserProfile((err, user) => dispatch(setUserProfile(user)));
    return (dispatch) => {
        return auth.getUserProfile((err, user) => {
            return dispatch(setUserProfile(user));
        });
    };
};