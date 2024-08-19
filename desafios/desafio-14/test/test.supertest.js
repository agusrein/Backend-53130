const supertest = require('supertest');
const requester = supertest('http://localhost:8080');
const { expect } = require('chai');

describe('Test de puntos funcionales de la App', () => {
    let cookie;
    describe('Usuarios :', () => {
        it('Se corrobora que un usuario se registre correctamente', async () => {
            const newUser = {
                first_name: 'Juan',
                last_name: 'Oviedo',
                email: 'oviedojuan20@gmail.com',
                pass: '1234',
                age: 24
            }

            const result = await requester.post('/api/register').send(newUser);

            expect(result.headers['set-cookie']).to.not.be.undefined;
        })
        it('Se evalúa el cambio de rol de un usuario común a premium, bidireccionalmente', async () => {
            const uid = '66aac3425397958c3bd1435e';

            const { statusCode, _body } = await requester.put(`/api/premium/${uid}`);
            expect(statusCode).to.equal(200);
            expect(_body.message).to.equal('Rol Actualizado');
        })
    })
    describe('Sesión :', () => {
        it('Inicio de sesión de un usuario', async () => {
            const login = {
                email: 'oviedojuan20@gmail.com',
                pass: '1234'
            };

            const result = await requester.post('/api/login').send(login);
            const cookieResult = result.headers['set-cookie'];
            
            cookie = cookieResult[0].split(';')[0];

            expect(cookieResult).to.not.be.undefined;
            expect(cookie).to.include('coderCookieToken');

        })

    })
    describe('Carrito :', () => {
        it('Se agrega un producto al carrito de compras', async () => {
            const pid = '6627cd1566294d3472f659f2';
            const cid = '66a7a98afadadfbad1ad65a4';
            const quantity = 1;

            const response = await requester.post(`/api/carts/${cid}/products/${pid}`).set('Cookie', cookie).send({ quantity });

            expect(response.status).to.equal(200);
            expect(response.body.message).to.equal('Producto Agregado');
            expect(response.body.cart).to.be.an('array').that.is.not.empty;
        });

        it('Se elimina un producto del carrito', async () => {
            const cid = '66a7a98afadadfbad1ad65a4'
            const pid = '6627cd1566294d3472f659f2'

            const { statusCode, body } = await requester.delete(`/api/carts/${cid}/products/${pid}`)

            expect(statusCode).to.equal(200);
            expect(body.message).to.equal('Producto Eliminado');
        })
        it('Se vacía el carrito de compras', async () => {
            const cid = '66a7a98afadadfbad1ad65a4'
            const { statusCode, body } = await requester.delete(`/api/carts/${cid}`);

            expect(statusCode).to.equal(200);
            expect(body.cart).to.be.an('array').that.is.empty;
        })
    })
})




