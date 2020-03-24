const jwt = require("jsonwebtoken");

//==========================================
//  Verificar Token
//==========================================
let verificaToken = (req, res, next) => {

    let token = req.get("token");

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: "Token no válido"
                }
            })
        }

        req.usuario = decoded.usuario;
        next();
    });


}

//==========================================
//  Verificar AdminRole
//==========================================

let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role !== "ADMIN_ROLE") {
        return res.json({
            ok: false,
            err: {
                message: "El usuario no es administrador"
            }
        })
    }

    next();

}

//==========================================
//  Verificar Token Imagen
//==========================================

let verificaTokenImg = (req, res, next) => {
  let token = req.query.token;

  jwt.verify(token, process.env.SEED, (err, decoded) => {

      if (err) {
          return res.status(401).json({
              ok: false,
              err: {
                  message: "Token no válido"
              }
          })
      }

      req.usuario = decoded.usuario;
      next();
  });

};

const asyncMiddleware = fn => (req, res, next) => {
    Promise
    .resolve(fn(req, res, next))
    .catch(next);
};

module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg,
    asyncMiddleware
}
