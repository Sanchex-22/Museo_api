/*-- Importa el middleware de autenticaión JWT --*/
const {authJwt} = require("../middleware");

/*-- Importa el middleware de Exhibit--*/
const { verifyCreateExhibit } = require("../middleware");

/*-- Importa el controlador de exhibit--*/
const exhibitController = require("../controllers/exhibit.controller");


/*  Exporta una función que toma la aplicación app como argumento.
    Esta función será utilizada por otro archivo para configurar
    las rutas y el middleware en la aplicación.
*/

module.exports = function(app){
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    app.get(
        "/api/crud/all", //Ruta GET para traer todas las exhibiciones
        [
         authJwt.verifyToken,
         authJwt.isAdmin
        ],
        exhibitController.getAllExhibit
    );

    app.get(
        "/api/crud/exhibit/:exhibitID", //Ruta GET para traer solo un registro de exhibición
        exhibitController.getExhibit
    );

    app.put(
        "/api/crud/updateExhibit/:exhibitID", //Ruta PUT para hacer update de un registro de exhibición
        [
            authJwt.verifyToken,
            authJwt.isAdmin,
            verifyCreateExhibit.checkUpdateDataNotEmpty
        ],
        exhibitController.updateExhibit
    );

    app.post(
        "/api/crud/createExhibit", //Ruta POST para crear un registro de exhibición
        [
            authJwt.verifyToken,
            authJwt.isAdmin,
            verifyCreateExhibit.validateCreateInput,
            verifyCreateExhibit.checkDuplicateTitle,
            verifyCreateExhibit.verifyCategoryExists
        ],
        exhibitController.createExhibit
    );

    app.delete(
        "/api/crud/deleteExhibit/:exhibitID", //Ruta DELETE para eliminar un registro de exhibición
        [
            authJwt.verifyToken,
            authJwt.isAdmin,
            verifyCreateExhibit.checkRecordExist,
        ],
        exhibitController.deleteExhibit
    );

    app.get(
        "/api/gerent/ExhibitStats", //Ruta GET para traer la lista de artículos que necesita el gerente
        [
            authJwt.verifyToken,
        ],
        exhibitController.getExhibitListWithStats
    );

}