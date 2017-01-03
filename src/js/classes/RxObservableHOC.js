"use strict";
import React, { Component, PropTypes } from 'react';
import { noop, forEach, isFunction } from 'lodash';

const validateHandlers = function(onNextHandler, onErrorHandler, onComplete) {
    const newHandlers = [];

    forEach(arguments, (arg) => {
        if(isFunction(arg)) {
            newHandlers.push(arg);
        } else {
            newHandlers.push(noop);
        }
    });

    return newHandlers;
};

// observableOperation & onNextHandler are Required!
const createObservable = (observableOperation, onNextHandler, onErrorHandler, onComplete) => {
    const [ _onNextHandler, _onErrorHandler, _onComplete ] = validateHandlers(onNextHandler, onErrorHandler, onComplete);

    //Setup Rx Observable
    const subscription = observableOperation.subscribe(
        _onNextHandler,
        _onErrorHandler,
        _onComplete
    );

    console.log('subscription: ', subscription);
    return subscription;
};

export { createObservable };