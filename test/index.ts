import  * as sinonChai from 'sinon-chai';
import  * as chai from 'chai';
import  * as chaiEnzyme from 'chai-enzyme';
console.log('here');
chai.use(sinonChai);
console.log('here 2');
chai.use(chaiEnzyme());

console.log('here 3');
// Ensure all files in src folder are loaded for proper code coverage analysis.
const srcContext = require.context('../src', true, /.*\.tsx?$/);
console.log('here 4');
srcContext.keys().forEach(srcContext);
console.log('here 5');
const testsContext = require.context('.', true, /.*\Spec.tsx?$/);
console.log('here 6', testsContext.keys());
testsContext.keys().forEach(testsContext);
console.log('here 7');
