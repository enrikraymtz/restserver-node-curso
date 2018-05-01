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
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//==========================================
//  SEED de autenticación
//==========================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


//==========================================
//  Base de datos
//==========================================

let urlBD;

if (process.env.NODE_ENV === "dev") {
    urlBD = 'mongodb://localhost:27017/cafe';
} else {
    urlBD = process.env.MONGO_URI;
}

process.env.URLBD = urlBD;

//==========================================
//  Google Client ID
//==========================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '738100415458-53j18g6cviasvlfmnepunvnugh1v400a.apps.googleusercontent.com';