/*-- Importa el archivo de modelos de la base de datos --*/
const db = require("../models");

/*-- Obtiene el modelo de las Exhibiciones --*/
const Exhibit = db.exhibits;
const Category = db.categories;


/* -- Middleware para verificar si el nombre de título de la exhibición ya está registrado -- */
checkDuplicateTitle = async (req, res, next) => {
    try {
        const {title} = req.body;
        const existingExhibit = await Exhibit.findOne({where: {title}});

        if(existingExhibit){
           return res.status(400).send({message: 'El título ya está en uso'});
        }

        next();
    } catch (error) {
        res.status(500).send({message: error.message});
    }
};


validateCreateInput = async (req, res, next) => {
    try {
        const {title, short_desc_url, founder, creation_date, categoryID} = req.body;

        if(!title || !short_desc_url || !founder || !creation_date || !categoryID){ //Valida que todos los campos estén llenos.
            return res.status(400).send ({message: 'Por favor completa todos los campos'});
        }

        return next();
    } catch (error) {
        res.status(500).send ({message: error.message});
    }
};


verifyCategoryExists = async (req, res, next) => {
    try {
        const categoryID = req.body.categoryID;                          //Recibe la id que viene en el cuerpo de la petición

        const category = await Category.findByPk(categoryID);            //Buscamos en la tabla de categorías a ver si existe

        if(!category){                                                   //Si no, enviamos el mensaje de que la categoría no existe.
            return res.status(404).send ({message: 'La categoría no existe'});
        }

        return next();
    } catch (error) {
        res.status(500).send ({message: error.message});
    }
};


checkRecordExist = async (req, res, next) => {
    try {
        const exhibitID = req.params.exhibitID;

        const exhibit = await Exhibit.findByPk(exhibitID);

        if(!exhibit){
           return  res.status(404).send ({message: 'No existe el registro'});
        }

        next();
    } catch (error) {
        res.status(500).send ({message: error.message});
    }
};


checkUpdateDataNotEmpty = (req, res, next) => {
    try {
        const {title, short_desc_url, founder, creation_date, categoryID} = req.body;

        if (
            (title && title.trim() === '') ||
            (short_desc_url && short_desc_url.trim() === '') ||
            (founder && founder.trim() === '') ||
            (creation_date && creation_date.trim() === '') ||
            (categoryID && categoryID.toString().trim() === '')
          ){
            return res.status(400).send ({message: 'Los campos no pueden dejarse vacíos'});
          }

          return next();
    } catch (error) {
        res.status(500).send ({message: error.message});
    }
};


const verifyCreateExhibit = {
    checkDuplicateTitle,
    validateCreateInput,
    verifyCategoryExists,
    checkRecordExist,
    checkUpdateDataNotEmpty
};


module.exports = verifyCreateExhibit;