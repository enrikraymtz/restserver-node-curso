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
    
    let objDes = {};
    var url = 'https://prd23gp04.itesm.mx:8080/EncripcionService/Encripcion?wsdl';

    Object.entries(body).forEach(([key, value]) => {
        console.log(key + ' ' + value);
        if ( key === "q" ) {
            objDes[key] = 1;
        } else {
            var args = {arg0: value};
            soap.createClient(url, function(err, client) {
                client.descifraLlaveHex(args, function(err, result) {
                    objDes[key] = result.return;
                });
            });  
        }
    });

    setTimeout(() => {
        console.log(objDes);
   
        let usuario = new Usuario({
            matricula: objDes.matricula,
            nombre: objDes.nombre,
            campus: objDes.campus,
            montoInicial: objDes.montoInicial,
            cantidad: objDes.cantidad,
            cveTienda: objDes.cveTienda,
            tipoMoneda: objDes.tipoMoneda,
            servicio: objDes.servicio,
            pedido: objDes.pedido,
            folioTienda: objDes.folioTienda,
            cveFormaPago: objDes.cveFormaPago,
            descFormaPago: objDes.descFormaPago,
            tipoTransaccion: objDes.tipoTransaccion,
            estatus: objDes.estatus,
            opcional: objDes.opcional,
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
    }, 5000);

});

function decript (data, res) {
    // console.log(data);
    
};

module.exports = app;