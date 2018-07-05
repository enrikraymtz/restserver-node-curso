const express = require("express");

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require("../models/producto");

// ===================================
//  Obtiene todos los productos
// ===================================
app.get('/productos', verificaToken, (req, res) => {
    // trae todos los productos
    // populate: usuario categoria
    //paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true})
          .skip(desde)
          .limit(limite)
          .sort('nombre')
          .populate('usuario', 'nombre email')
          .populate('categoria', 'descripcion')
          .exec( (err, productos) =>{
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
              ok:true,
              productos
            });
          });


});


// ===================================
//  Obtiene un producto por ID
// ===================================
app.get('/productos/:id', verificaToken, (req, res) => {
    // populate: usuario categoria
    let id = req.params.id;

    Producto.findById( id )
      .populate('usuario', 'nombre email')
      .populate('categoria', 'descripcion')
      .exec( (err, productoDB) =>{
      if (err) {
          return res.status(500).json({
              ok: false,
              err
          })
      }
      if (!productoDB) {
          return res.status(400).json({
              ok: false,
              err: {
                  "message": "El ID no es correcto"
              }
          })
      }
      res.json({
        ok:true,
        producto: productoDB
      });
    });

});

// ===================================
//  Obtiene un producto por ID
// ===================================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
  let termino = req.params.termino;

  let regex = new RegExp(termino, 'i');

  Producto.find({ nombre: regex})        
        .populate('categoria', 'descripcion')
        .exec( (err, productos) =>{
          if (err) {
              return res.status(500).json({
                  ok: false,
                  err
              })
          }

          res.json({
            ok:true,
            productos
          });
        });

});

// ===================================
//  Crear un nuevo producto
// ===================================
app.post('/productos', verificaToken, (req, res) => {
    // grabar un producto
    // grabar una categoria

    let body = req.body;

    let producto = new Producto({
      nombre: body.nombre,
      precioUni: body.precioUni,
      descripcion: body.descripcion,
      categoria: body.categoria,
      usuario: req.usuario._id
    });

    producto.save( (err, productoDB) => {
      if (err) {
          return res.status(500).json({
              ok: false,
              err
          })
      }
      if (!productoDB) {
          return res.status(400).json({
              ok: false,
              err
          })
      }
      res.json({
        ok:true,
        producto
      });
    });

});

// ===================================
//  Actualizar un producto
// ===================================
app.put('/productos/:id', verificaToken, (req, res) => {
    // actualiza un producto
    let id = req.params.id;
    let body = req.body;

    Producto.findById( id, (err, productoDB) => {
      if (err) {
          return res.status(500).json({
              ok: false,
              err
          })
      }
      if (!productoDB) {
          return res.status(400).json({
              ok: false,
              err
          })
      }

      productoDB.nombre = body.nombre;
      productoDB.precioUni = body.precioUni;
      productoDB.descripcion = body.descripcion;
      productoDB.disponible = body.disponible;
      productoDB.categoria = body.categoria;

      productoDB.save( (err, productoGuardado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
          pk: true,
          producto: productoGuardado
        })

      });

    });

    /*
    let productoUpd = {
      nombre: body.nombre,
      precioUni: body.precioUni,
      descripcion: body.descripcion
    };

    Producto.findByIdAndUpdate(id, productoUpd,  { new: true, runValidators: true }, (err, productoDB) =>{
      if (err) {
          return res.status(500).json({
              ok: false,
              err
          })
      }
      if (!productoDB) {
          return res.status(400).json({
              ok: false,
              err
          })
      }
      res.json({
        ok: true,
        producto: productoDB
      });
    });
    */
});

// ===================================
//  Eliminar un producto
// ===================================
app.delete('/productos/:id', verificaToken, (req, res) => {
    // cambia el estado del producto disponible false
    let id = req.params.id;
    let cambiaEstado = {
      disponible: false
    }

    Producto.findByIdAndUpdate( id, cambiaEstado, { new: true }, (err, productoBorrado) => {
      if (err) {
          return res.status(500).json({
              ok: false,
              err
          })
      }
      if (!productoBorrado) {
          return res.status(400).json({
              ok: false,
              err
          })
      }
      res.json({
        ok: true,
        producto: productoBorrado
      });
    });

});


module.exports = app;
