import chai from 'chai'
import supertest from 'supertest'

const expect = chai.expect
const req = supertest('http://localhost:8080')


describe('Test continents', () => {
    it('/GET', async () => {
        const { statusCode, _body } = await req.get('/api/continents')

        expect(statusCode).to.be.eql(200)
        expect(_body).to.have.property()
    });
    
});
