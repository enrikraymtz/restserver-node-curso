var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var alumnoSchema = new Schema({
    matricula: { type: String  }, 
    nombre: { type: String  }, 
    campus: { type: String }, 
    montoInicial: { type: Number  }, 
    cantidad: { type: Number  }, 
    cveTienda: { type: String  }, 
    tipoMoneda: { type: String  }, 
    servicio: { type: String  }, 
    pedido: { type: String  }, 
    folioTienda: { type: String  }, 
    cveFormaPago: { type: String  }, 
    descFormaPago: { type: String  }, 
    tipoTransaccion: { type: String  }, 
    estatus: { type: String  },
    opcional: { type: String  },
    q: { type: String  }
});

module.exports = mongoose.model('Alumno', alumnoSchema);
