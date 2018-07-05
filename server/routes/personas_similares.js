const express = require('express');

const app = express();

const { verificaTokenImg } = require('../middlewares/autenticacion');

app.get('/TECM/personas/detectaSimilares',  (req, res) => {
  let nombre = req.query.nombre;
  let paterno = req.query.apellidoPaterno;

  let materno = req.query.apellidoMaterno;
  let nacimiento = req.query.fechaNacimiento;
  let claveGenero = req.query.claveGenero;
  let clave_nacimiento = req.query.clavePoblacionNacimiento;

  let json =  {
    collection: {
      version: "1.0",
      href: "esbsvrqa01.itesm.mx:8081/TECM/personas/detectaSimilares",
      items: [
        {
          data: [ ]
        }
      ],
      template: {

        data: [ ]
      }
    }
  }

  if( nombre == "Henry David" && paterno == "Raymundo" && materno == "Martinez"  ){
    let data = { nombre, paterno, materno, nacimiento, claveGenero, clave_nacimiento };
    json.collection.items[0].data.push(data);
    json.collection.template.data.push(data);
  }

  console.log("nombre: ", nombre, " paterno: ", paterno, " materno: ", materno," fecha nacimiento: ", nacimiento, "clave_nac: ", clave_nacimiento )
  res.json( json );

});

app.get("/hola",  (req, res) => {

    console.log("nombre: hola")
    
    let json =  {
        collection: {
          version: "1.0",
          href: "esbsvrqa01.itesm.mx:8081/TECM/personas/detectaSimilares",
          items: [
            {
              data: [ ]
            }
          ],
          template: {

            data: [ ]
          }
        }
      }
    
      res.json({
        ok:true,
        data: "Hola"
      });
    
  });
  
//?nombre/nombre/:nombre/apellido_paterno/:paterno/apellido_materno/:materno/fecha_nacimiento/:nacimiento/clave_poblacion_nacimiento/:clave_nacimiento
module.exports = app;