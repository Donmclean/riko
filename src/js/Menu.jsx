import React from 'react';
import Sample from './components/Sample';

const Menu = () => (
    <ul className="mainMenu">
        <li><a href="#">File</a></li>
        <li><a href="#">Edit</a></li>
        <li><a href="#">Help</a></li>
        <Sample/>
    </ul>
);

export default Menu;