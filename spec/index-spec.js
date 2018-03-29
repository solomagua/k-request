const KR = require('../index');
const TestDB = 'mongodb://admin:admin@ds127899.mlab.com:27899/k-request-test';
global.KR = new KR(TestDB, 'jasmine-test');

describe('Test', () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
  describe('Basic', () => {
    beforeAll(() => console.log('\nBasic'));
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

  describe('Log Errors', () => {
    beforeAll(() => console.log('\nLog Errors'));
    const options = {
      url: 'https://jsonplaceholder.typicode.com/posts/2',
      method: 'GET',
      LOG: {
        TYPE: KR.ERROR
      }
    }
    it('must_be_logged should be false', (done) => {
      global.KR.request(options, (error, response, body, must_be_logged) => {
        expect(must_be_logged).toBe(false);
        done();
      });
    });
  });

  describe('Log statusCode == 200', () => {
    beforeAll(() => console.log('\nLog statusCode == 200'));
    const options = {
      url: 'https://jsonplaceholder.typicode.com/posts/3',
      method: 'GET',
      LOG: {
        TYPE: KR.STATUS_CODE_EQ,
        ARG: 200
      }
    }
    it('must_be_logged should be true', (done) => {
      global.KR.request(options, (error, response, body, must_be_logged) => {
        expect(must_be_logged).toBe(true);
        done();
      });
    });
  });

  describe('Log statusCode != 200', () => {
    beforeAll(() => console.log('\nLog statusCode != 200'));
    const options = {
      url: 'https://jsonplaceholder.typicode.com/posts/4',
      method: 'GET',
      LOG: {
        TYPE: KR.STATUS_CODE_NE,
        ARG: 200
      }
    }
    it('must_be_logged should be false', (done) => {
      global.KR.request(options, (error, response, body, must_be_logged) => {
        expect(must_be_logged).toBe(false);
        done();
      });
    });
  });
  describe('Log statusCode <= 200', () => {
    beforeAll(() => console.log('\nLog statusCode <= 200'));
    const options = {
      url: 'https://jsonplaceholder.typicode.com/posts/5',
      method: 'GET',
      LOG: {
        TYPE: KR.STATUS_CODE_LE,
        ARG: 200
      }
    }
    it('must_be_logged should be true', (done) => {
      global.KR.request(options, (error, response, body, must_be_logged) => {
        expect(must_be_logged).toBe(true);
        wait(() => { done(); }); // Para que de tiempo a guardar antes de finalizar el proceso.
      });
    });
  });
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function wait(cb) {
  await sleep(2000)
  .then(() => {
    return cb();
  });
}
