import supertes from 'supertest';
import server from '../src/server';

test("Deve responder na porta 3000", async () => {
    const response = await supertes(server).get('/');
    expect(response.status).toBe(200);
})

