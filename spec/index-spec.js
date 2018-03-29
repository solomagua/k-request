const KR = require('../index');
const TestDB = 'mongodb://admin:admin@ds127899.mlab.com:27899/k-request-test';
global.KR = new KR(TestDB, 'jasmine-test');

describe('Test', () => {
  describe('Basic', () => {
    beforeAll(() => console.log('Basic'));
    const options = {
      url: 'https://jsonplaceholder.typicode.com/posts/1',
      method: 'GET'
    }
    it('should return 200 OK', (done) => {
      global.KR.request(options, (error, response, body) => {
        expect(response.statusCode).toBe(200);
        done();
      });
    });
  });
});
