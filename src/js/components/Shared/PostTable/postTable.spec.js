import React from 'react';

//For testing components
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
const middlewares = []; //eg: [thunk] for async | eg: [epicMiddleware] for testing epics
const mockStore = configureStore(middlewares);

//This contains all reducers and their 'initialState' ready to be placed in 'mockStore' for testing
//This should be ideal for testing dummy components
import { mockStoreInitialState } from '../../../_Reducers';

//Component to be Tested
import PostTable from './index';

describe('PostTable Test Suite', () => {
    let store;

    beforeEach(() => {
        //Initialize mockStore with initial state of the reducers
        store = mockStore(mockStoreInitialState);
    });

    describe('PostTable Component', () => {
        it('renders <PostTable /> component successfully in to the DOM with required props & state', () => {

            //Verify props
            const wrapper = shallow(<PostTable store={store}/>);
            expect(wrapper.prop('store')).toEqual(store);

            //Verify that initial State of the store is rendered correctly
            expect(wrapper.state().storeState).toEqual(store.getState());

            //Render Component Tree
            const component = renderer.create(
                <PostTable store={store}/>
            );

            //Verify Component Snapshot
            //call component to JSON before matching snapshot
            expect(component.toJSON()).toMatchSnapshot();
        });
    });
});