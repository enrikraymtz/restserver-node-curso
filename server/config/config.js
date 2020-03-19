//==========================================
//  Puerto
//==========================================

process.env.PORT = process.env.PORT || 3000;

//==========================================
//  Entorno
//==========================================

process.env.NODE_ENV = process.env.NODE_ENV || "dev";

//==========================================
//  Caducidad del token
// 60 seg * 60 min * 24 hrs * 30 dias
//==========================================
process.env.CADUCIDAD_TOKEN = '48h'; // 60 * 60 * 24 * 30;

//==========================================
//  SEED de autenticación
//==========================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


//==========================================
//  Base de datos
//==========================================

let urlBD;

if (process.env.NODE_ENV === "dev") {
    urlBD = 'mongodb+srv://hdrm:FiSneZOLniXME81O@cluster0-lisg6.mongodb.net/fv?retryWrites=true&w=majority';
    //urlBD = 'mongodb://localhost:27017/cafe';
} else {
    urlBD = 'mongodb+srv://hdrm:FiSneZOLniXME81O@cluster0-lisg6.mongodb.net/fv?retryWrites=true&w=majority';
    // urlBD = process.env.MONGO_URI;
}

process.env.URLBD = urlBD;
