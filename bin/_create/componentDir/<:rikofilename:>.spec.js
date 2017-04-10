import React from 'react';
import renderer from 'react-test-renderer';

import <:rikofilename:> from './index';

describe('<:rikofilename:> Component', () => {
    it('renders <<:rikofilename:> /> component successfully in to the DOM', () => {

        const component = renderer.create(
            <<:rikofilename:> />
        );

        //Verify Component Snapshot
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});