import React from 'react';
import { createRenderer } from 'react-addons-test-utils';
import createComponent from 'react-unit';
import tape from 'tape';
import addAssertions from 'extend-tape';
import jsxEquals from 'tape-jsx-equals';
const test = addAssertions(tape, {jsxEquals});

// Component to test
import Welcome from '../../components/Welcome';

test('----- React Component Tests: Welcome -----', (t) => {

  // Shallow rendering: Render React element only *one* level deep
  const component = createComponent.shallow(<Welcome />);

  t.equal(component.text, 'Welcome to KTS.');

  // Test rendered output
  const renderer = createRenderer();
  renderer.render(<Welcome />);
  const result = renderer.getRenderOutput();
  t.jsxEquals(result,
  <div>
    <p>Welcome to KTS.</p>
  </div>);

  t.end();
});
