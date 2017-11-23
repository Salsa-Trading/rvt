// Ensure all files in src folder are loaded for proper code coverage analysis.
import * as chai from 'chai';
import * as chaiEnzyme from 'chai-enzyme';

const srcContext = require.context('../src', true, /.*\.tsx?$/);
srcContext.keys().forEach(srcContext);

const testsContext = require.context('.', true, /.*\Spec.tsx?$/);
testsContext.keys().forEach(testsContext);

chai.use(chaiEnzyme());
