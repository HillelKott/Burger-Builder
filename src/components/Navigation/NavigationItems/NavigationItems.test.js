import React from 'react';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
// import Enzyme from 'enzyme';

import NavigationItems from './NavigationItems';
import NavigationItem from './NavigationItem/NavigationItem';

configure({ adapter: new Adapter() });
let wrapper;
beforeEach(() => {
    wrapper = shallow(<NavigationItems />);
})

describe('<navigationItems/>', () => {
    it('should render tow navigation elements if not authanticated', () => {
        expect(wrapper.find(NavigationItem)).toHaveLength(2);
    });

    it('should render tow navigation elements if authanticated', () => {
        wrapper.setProps({
            isAuthenticated: true
        });
        expect(wrapper.find(NavigationItem)).toHaveLength(3);
    });

    it('should contains logout button', () => {
        wrapper.setProps({
            isAuthenticated: true
        });
        expect(wrapper.contains(<NavigationItem link='/logout'>Loguot</NavigationItem>)).toEqual(true);
    });
});
