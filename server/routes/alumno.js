const express = require('express');
var bcrypt = require('bcrypt');
const _ = require("underscore");
const soap = require('soap');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
const Usuario = require('../models/alumnos');

const app = express();

app.get('/usuario', verificaToken, function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, count) => {
                res.json({
                    ok: false,
                    usuarios,
                    cuantos: count
                });
            });

        });
});

app.post('/usuario', [verificaToken, verificaAdmin_Role], function(req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});

app.post('/api/tienda/aviso', function(req, res) {
    let body = req.body;
    console.log(body);
    let usuario = new Usuario({
        matricula: decript(body.matricula),
        nombre: decript(body.nombre),
        campus: decript(body.campus),
        montoInicial: decript(body.montoInicial),
        cantidad: decript(body.cantidad),
        cveTienda: decript(body.cveTienda),
        tipoMoneda: decript(body.tipoMoneda),
        servicio: decript(body.servicio),
        pedido: decript(body.pedido),
        folioTienda: decript(body.folioTienda),
        cveFormaPago: decript(body.cveFormaPago),
        descFormaPago: decript(body.descFormaPago),
        tipoTransaccion: decript(body.tipoTransaccion),
        estatus: decript(body.estatus),
        opcional: decript(body.opcional),
        q: body.q
    });

    console.log(usuario);

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});

function decript (data, res) {
    // console.log(data);
    var url = 'https://prod023ms04.itesm.mx:8080/EncripcionService/Encripcion?wsdl';
    var args = {arg0: data};
    soap.createClient(url, function(err, client) {
        console.log(client);
        client.descifra_llave_hex(args, function(err, result) {
            console.log(result);
            console.log(err);
            res = result;
            return res;
        });
    });  
};

module.exports = app;