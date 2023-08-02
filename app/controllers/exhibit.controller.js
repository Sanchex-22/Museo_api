const db = require("../models");                  // Importa el archivo de modelos de la bd
const Exhibit = db.exhibits;                      // Obtiene el modelo de exhibit desde la bd
const Op = db.Sequelize.Op;                       //Obtiene el operador Sequelize para realizar consultas
const ExhibitsStats = db.exhibits_stats;                  //Obtiene el modelo de las estadísticas desde la bd


/*-- OBTENIENDO LOS MODELOS EN LA BASE DE DATOS QUE TIENEN QUE VER CON MULTIMEDIOS --*/
const ExhibitImage = db.exhibits_images;          // Obtiene el modelo de Exhibit Images
const ExhibitText = db.exhibits_texts;             // Obtiene el modelo de ExhibitText que incluye audios
const ExhibitQR = db.exhibits_qrs;                 // Obtiene el modelo de ExhibitQR para las imágenes de los QR
const ExhibitGif = db.exhibits_gifs;                // Obtiene el modelo de ExhibitGif
const ExhibitVideo = db.exhibits_videos;          // Obtiene el modelo de ExhibitVideo   
/*-- OBTENIENDO LOS MODELOS EN LA BASE DE DATOS QUE TIENEN QUE VER CON MULTIMEDIOS --*/

const sequelize = db.sequelize;



/*-- Controlador para traer todos los registros de exhibiciones  --*/
exports.getAllExhibit = async (req, res) => {
    try {
      const exhibits = await Exhibit.findAll({
        attributes: ['exhibitID', 'title', 'founder', 'short_desc_url', 'creation_date', 'categoryID'],
        include: [
          {
            model: ExhibitImage,
            attributes: ['image_url'],
            limit: 1, // Limitar a solo una imagen por exhibición
          },
        ],
      });
  
      // Agregar el campo image_url al objeto exhibit
      exhibits.forEach((exhibit) => {
        exhibit.image_url = exhibit.exhibits_images.length > 0 ? exhibit.exhibits_images[0].image_url : null;
        delete exhibit.exhibits_images; // Eliminar la propiedad exhibits_images
      });
  
      return res.send(exhibits);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  };


/*-- Controlador para mostrar solo un registro de exhibición --*/
exports.getExhibit = async (req, res) => {
    try {
        const exhibit = await Exhibit.findByPk(req.params.exhibitID); //Busca el registro por su clave primaria

        if(!exhibit){                                                 //En caso de no existir le manda un mensaje de error
            return res.status(404).send({message: 'El registro no existe'});
        }
        return res.status(200).send({exhibit});
    } catch (error) {
        return res.status(500).send({message: error.message});
    }
};


/*-- Controlador para crear un registro --*/
exports.createExhibit = async (req, res) => {
    try {
        const { title, short_desc_url, founder, creation_date, categoryID } = req.body;

        const exhibit = await Exhibit.create({
            title,
            short_desc_url,
            founder,
            creation_date,
            categoryID
        });

       return res.status(201).send({ message: 'Artículo registrado con éxito!' });
    } catch (error) {
       return res.status(500).send({ message: error.message });
    }
};


/*-- Controlador para actualizar un registro --*/
exports.updateExhibit = async (req, res) => {
    try {
        const exhibitID = req.params.exhibitID;
        const { title, short_desc_url, founder, creation_date, categoryID } = req.body;
        
        const exhibit = await Exhibit.findByPk(exhibitID);

        if (!exhibit) {
            return res.status(404).send({ message: 'No existe el registro' });
        }

        exhibit.title = title || exhibit.title;
        exhibit.short_desc_url = short_desc_url || exhibit.short_desc_url;
        exhibit.founder = founder || exhibit.founder;
        exhibit.creation_date = creation_date || exhibit.creation_date;
        exhibit.categoryID = categoryID || exhibit.categoryID;

        await exhibit.save();

        return res.status(200).send({ message: 'Actualizado correctamente' });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};


/*-- Controlador para eliminar un registro--*/
exports.deleteExhibit = async (req, res) => {
    try {
        const exhibitID = req.params.exhibitID;
        const exhibit = await Exhibit.findByPk(exhibitID);
        
        if(!exhibit){
            return res.status(400).send ({message: 'No se encontró el registro'});
        }
        await exhibit.destroy();

        return res.status(201).send ({message: 'Eliminado correctamente!'});
    } catch (error) {
        return res.status(500).send({message: error.message});
    }
};

/*-- Controlador para hacer get de la lista --*/
exports.getExhibitListWithStats = async (req, res) => {
  try {
    const exhibitList = await Exhibit.findAll({
      attributes: ["exhibitID", "title"],
      include: [
        {
          model: ExhibitsStats,
          attributes: ["totalViews", "totalLikes", "totalShares"],
        },
        {
          model: ExhibitImage,
          attributes: ["image_url"],
          limit: 1, // Limitar a solo una imagen por exhibición
        },
      ],
    });

    // Reformatear los datos para que estén en el mismo nivel
    const formattedExhibitList = exhibitList.map((exhibit) => ({
      exhibitID: exhibit.exhibitID,
      title: exhibit.title,
      totalViews: exhibit.exhibits_stat ? exhibit.exhibits_stat.totalViews : 0,
      totalLikes: exhibit.exhibits_stat ? exhibit.exhibits_stat.totalLikes : 0,
      totalShares: exhibit.exhibits_stat ? exhibit.exhibits_stat.totalShares : 0,
      image_url:
        exhibit.exhibits_images.length > 0
          ? exhibit.exhibits_images[0].image_url
          : null,
    }));

    res.status(200).send({ exhibitList: formattedExhibitList });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
  

