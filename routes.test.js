process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('./app');
const db = require('./db');

let customer;
let secondCustomer = { "firstName": "John", "lastName": "Snow", "phone": "566-060-0650", "notes": "I am not a king" }

beforeEach(async () => {
    const results = await db.query(
        `INSERT INTO customers (first_name, last_name, phone, notes) 
        VALUES ('James', 'Bond', '007-007-0007', 'No time to die') 
        RETURNING id, first_name, last_name, phone, notes`);
    customer = results.rows[0]
    const reservations = await db.query(
        `INSERT INTO reservations (customer_id, start_at, num_guests, notes) 
            VALUES ($1, $2, $3, $4) 
            RETURNING id, customer_id, start_at, num_guests, notes`,
        [customer.id, '2018-09-08 12:20:07-07', 4, 'Party time']);

});

afterEach(async () => {
    await db.query('DELETE FROM customers');
});

afterAll(async () => {
    await db.end();
});

describe('GET /', () => {
    test('Get all customers', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain('Bond James');
    });
});

describe('GET /:id', () => {
    test('Get customer using id', async () => {
        const response = await request(app).get(`/${customer.id}`);
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain('Bond James')
    });
});

describe('GET /frequent_flyers', () => {
    test('Get a list of top 10 returning customers', async () => {
        const response = await request(app).get(`/frequent_flyers`)
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain('Bond James');
    })
})

describe('GET /search', () => {
    test('Find customer by name', async () => {
        const response = await request(app).get(`/search?q=${customer.last_name}`)
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain('Bond James');
    })
})

describe('POST /add', () => {
    test('Add new customer', async () => {
        const response = await request(app).post(`/add`)
        expect(response.statusCode).toBe(201);
        expect(response.text).toContain('Snow John');
    })
})

