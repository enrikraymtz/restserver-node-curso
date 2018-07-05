const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const fs = require("fs");
const path = require("path");

let Usuario = require("../models/usuarios");
let Producto = require("../models/producto");

app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

  let tipo = req.params.tipo;
  let id = req.params.id;

  if (!req.files){
    return res.status(400).json({
      ok: false,
      err :{
        "message": "No se ha seleccionado ningun archivo."
      }
    })
  }

  //Valida tipo
  let tiposValidos = ["productos","usuarios"];
  if( tiposValidos.indexOf( tipo ) < 0 ){
    return res.status(400).json({
      ok:false,
      err: {
        "message": "Los tipos permitidos son los siguientes: " + tiposValidos.join(", ")
      }
    });
  }

  let archivo  = req.files.archivo;
  let nombreCortado = archivo.name.split('.');
  let extension = nombreCortado[nombreCortado.length - 1];

  //Extensiones permitidas
  let extensionesPermitidas = ["jpg", "png", "gif", "jpeg"];

  if( extensionesPermitidas.indexOf( extension ) < 0 ){
    return res.status(400).json({
      ok:false,
      err: {
        "message": "Las extensiones permitidas son las siguientes: " + extensionesPermitidas.join(", ")
      }
    });
  }

  //Cambiar el nombre del Archivo
  let nombreArchivo = `${id}-${ new Date().getMilliseconds() }.${extension}`;

  archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {
    if (err){
      return res.status(500)
        .json({
          ok:false,
          err
        });
    }

    //Aqui la imagen ha sido cargada
    if( tipo === "usuarios"){
      imagenUsuario(id, res, nombreArchivo);
    }else if( tipo === "productos"){
      imagenProducto(id, res, nombreArchivo);
    }

  });

});

function imagenUsuario(id, res, nombreArchivo){
  Usuario.findById( id, (err, usuarioDB) => {
    if(err){
      borrarImagen(nombreArchivo, 'usuarios');
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if(!usuarioDB){
      borrarImagen(nombreArchivo, 'usuarios');
      return res.status(400).json({
        ok: false,
        err: {
          "message": `El usuario con el id ${id} no existe.`
        }
      });
    }

    borrarImagen(usuarioDB.img, 'usuarios');
    usuarioDB.img = nombreArchivo;

    usuarioDB.save( (err, usuarioGuardado) =>{
      res.json({
        ok: true,
        usuario: usuarioGuardado,
        img: nombreArchivo
      })
    });

  });
}

function imagenProducto(id, res, nombreArchivo){
  Producto.findById( id, (err, productoDB) => {
    if(err){
      borrarImagen(nombreArchivo, 'productos');
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if(!productoDB){
      borrarImagen(nombreArchivo, 'productos');
      return res.status(400).json({
        ok: false,
        err: {
          "message": `El producto con el id ${id} no existe.`
        }
      });
    }

    borrarImagen(productoDB.img, 'productos');
    productoDB.img = nombreArchivo;

    productoDB.save( (err, productoGuardado) =>{
      res.json({
        ok: true,
        producto: productoGuardado,
        img: nombreArchivo
      })
    });

  });
}

function borrarImagen(nombreImagen, tipo){
  let pathImagen = path.resolve( __dirname, `../../uploads/${ tipo }/${ nombreImagen }` );
  if( fs.existsSync(pathImagen) ){
    fs.unlinkSync(pathImagen);
  }
}

module.exports = app;
