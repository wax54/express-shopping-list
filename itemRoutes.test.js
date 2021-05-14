process.env.NODE_ENV = 'testing';

const request = require('supertest');
const app = require('./app');
const items = require('./fakeDb');
const Item = require('./Item');

const kitkat = { name: "kitkat", price: "1.50" };

beforeEach(() => {
    items.push(kitkat);
});

afterEach(() => {
    items.length = 0;
});

describe('GET /items', () => {
    test('Recieves Items', async () => {
        const res = await request(app).get('/items');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([kitkat]);
    })
});

describe('POST /items', () => {
    test('Returns the new item', async () => {
        const anItem = new Item('Detergent', 1.35)
        const res = await request(app).post('/items').send(anItem.serialize());
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({added: anItem.serialize()});
    });

    test('New Item in items', async () => {
        const anItem = new Item('Detergent', 1.35)
        const res = await request(app).post('/items').send(anItem.serialize());
        expect(items.length).toBe(2);
        expect(items[1]).toEqual(anItem.serialize());
    });

    test('throws 400 if missing inputs', async () => {
        let res = await request(app).post('/items').send();
        expect(res.statusCode).toBe(400);

        res = await request(app).post('/items').send({name:'snickers'});
        expect(res.statusCode).toBe(400);

        res = await request(app).post('/items').send({ price: '12.50' });
        expect(res.statusCode).toBe(400);

    });
});


describe('GET /items/:name', () => {
    test('Responds with item', async () => {
        const res = await request(app).get(`/items/${kitkat.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(kitkat);
    })

    test('throws 404 if no item', async () => {
        const res = await request(app).get('/items/nadabing');
        expect(res.statusCode).toBe(404);
    })
});

describe('PATCH /items/:name', () => {
    const updatedData = { name: "snickers", price: 100.12 };
    test('Responds with item', async () => {
        const res = await request(app)
            .patch(`/items/${kitkat.name}`)
            .send(updatedData);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({updated: updatedData});
    })
    test('Updated Item in items', async () => {
        const res = await request(app)
            .patch(`/items/${kitkat.name}`)
            .send(updatedData);
        expect(items.length).toBe(1);
        expect(items[0]).toEqual(updatedData);
    });

    test('missing inputs OK', async () => {
        let res = await request(app)
            .patch(`/items/${kitkat.name}`)
            .send();
        expect(res.statusCode).toBe(200);
        expect(items[0]).toEqual(kitkat);

        res = await request(app)
            .patch(`/items/${kitkat.name}`)
            .send({ name: updatedData.name });
        expect(res.statusCode).toBe(200);
        expect(items[0].name).toEqual(updatedData.name);
        expect(items[0].price).toEqual(kitkat.price);

        res = await request(app)
            .patch(`/items/${kitkat.name}`)
            .send({ price: updatedData.price });
        expect(res.statusCode).toBe(200);
        expect(items[0].price).toEqual(updatedData.price);
    });

    test('throws 404 if no item', async () => {
        const res = await request(app).get('/items/nadabing');
        expect(res.statusCode).toBe(404);
    })
});


describe('DELETE /items/:name', () => {
    test('Responds with message Deleted', async () => {
        const res = await request(app)
            .delete(`/items/${kitkat.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: "Deleted" });
    })

    test('throws 404 if no item', async () => {
        const res = await request(app).get('/items/nadabing');
        expect(res.statusCode).toBe(404);
    })
});