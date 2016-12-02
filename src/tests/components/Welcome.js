import test from 'tape'
import React from 'react';
import { shallow } from 'enzyme';

// Component to test
import Welcome from '../../components/Welcome';

test('<Welcome /> renders the welcome page', t => {
  const wrapper = shallow(<Welcome />);

  t.equal(wrapper.contains(<p>Welcome to KTS.</p>), true);

  t.end();
});
