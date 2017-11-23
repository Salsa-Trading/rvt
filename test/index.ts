// Ensure all files in src folder are loaded for proper code coverage analysis.

import { configure } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
import * as chaiEnzyme from 'chai-enzyme';

const srcContext = require.context('../src', true, /.*\.tsx?$/);
srcContext.keys().forEach(srcContext);

const testsContext = require.context('.', true, /.*\Spec.tsx?$/);
testsContext.keys().forEach(testsContext);

configure({ adapter: new Adapter() });
chai.use(sinonChai);
chai.use(chaiEnzyme());
