import test from 'tape';
import React from 'react';
import { shallow } from 'enzyme';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import createMemoryHistory from 'history/lib/createMemoryHistory';

// Component to test
import Signin from '../../components/Signin';

test('----- React Component Tests: Signin -----', t => {

  const wrapper = shallow(<Signin history={createMemoryHistory()}/>);

  wrapper.instance().handleSubmit();

  t.equal(wrapper.state('emailSet'), false);
  t.equal(wrapper.state('passwSet'), false);

  t.equal(wrapper.contains(<HelpBlock>Username is required</HelpBlock>), true);
  t.equal(wrapper.contains(<HelpBlock>Password is required</HelpBlock>), true);

  wrapper.setState({
    email: 'test@example.com',
    passw: 'hello123'
  });

  wrapper.instance().handleSubmit();

  t.equal(wrapper.state('emailSet'), true);
  t.equal(wrapper.state('passwSet'), true);


  t.end();
});
