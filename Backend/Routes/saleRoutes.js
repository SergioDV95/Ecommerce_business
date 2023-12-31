const saleRouter = require("express").Router();
const { Sales, Products, Users } = require("../Model/models");

//Rutas GET

saleRouter.get("/", async (req, res) => {
   try {
      let fields = {};
      for (let field in req.query) {
         if (req.query[field]) {
            fields[field] = req.query[field];
         }
      }
      const options = {page: parseInt(fields.page) || 1, limit: parseInt(fields.limit) || 10};
      let query = {deleted: false};
      if (fields.search) {
         const search = fields.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
         query = {
            ...query,
            $or: [
               { client: { $regex: search, $options: "i" } },
               { vendor: { $regex: search, $options: "i" } },
               { products: { $regex: search, $options: "i" } }
            ]
         };
      }
      if (fields.vendor) {
         query = {
            ...query,
            vendor: fields.vendor
         };
         if (fields.search) {
            delete query.$or;
            const search = fields.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            query = {
               ...query,
               vendor: fields.vendor,
               $or: [
                  { client: { $regex: search, $options: "i" } },
                  { products: { $regex: search, $options: "i" } }
               ]
            };
         }
      }
      const sale = await Sales.paginate(query, options);
      return res.status(200).json(sale);
   } catch (error) {
      console.error(`${error.name}: ${error.message}`);
      return res.status(405).json({error: error.name, message: error.message});
   }
});

//Rutas POST

saleRouter.post("/", async (req, res) => {
   try {
      let { client, vendor, products} = req.body;
      const Client = await Users.findOne({_id: client}, {email: 1});
      const ProductsList = await Products.find({_id: { $in: products }}, {name: 1});
      let sale;
      if (Client && ProductsList) {
         sale = new Sales({
            ...req.body, 
            client: Client.email,
            vendor: "N/A",
            products: ProductsList.map(product => product.name)
         });
      } else {
         return res.status(404).json({error: "No se encontraron datos"});
      }
      if (vendor) {
         const Vendor = await Users.findOne({_id: vendor}, {email: 1});
         sale.vendor = Vendor.email;
      }
      await sale.save();
      return res.status(201).json(sale);
   } catch (error) {
      console.error(`${error.name}: ${error.message}`);
      return res.status(400).json({ error: error.name, message: error.message });
   }
});

//Rutas PATCH

saleRouter.patch("/", async (req, res) => {
   try {
      let fields = {};
      for (let field in req.body) {
         if (req.body[field]) {
            fields[field] = req.body[field];
         }
      }
      const sale = await Sales.findById(fields.Id);
      if (!sale) {
         return res.status(404).json({error: "Venta no encontrada"});
      }
      //SOFT Delete
      if (fields.deleted) {
         sale.deleted = fields.deleted;
         await sale.save();
         return res.status(202).json(sale);
      }
      let errors = {};
      for (const field in fields) {
         if (fields[field] === sale[field]) {
            errors[field] = "El nuevo valor debe ser distinto del anterior";
         }
      }
      if (Object.keys(errors).length > 0) {
         return res.status(400).json(errors);
      }
      Object.assign(sale, fields);
      await sale.save();
      return res.status(202).json(sale);
   } catch (error) {
      console.error(`${error.name}: ${error.message}`);
      return res.status(404).json({error: error.name, message: error.message});
   }
});

//Rutas DELETE para las pruebas en la base de datos

saleRouter.delete("/:id", async (req, res) => {
   try {
      let saleDeleted = await Sales.deleteOne({_id: req.params.id});
      return res.json(saleDeleted);
   } catch (error) {
      console.error(`${error.name}: ${error.message}`);
      return res.status(404).json({error: error.name, message: error.message})
   }
});

saleRouter.delete("/", async (req, res) => {
   try {
      let saleDeleted;
      if (Object.keys(req.query).length > 0) {
         saleDeleted = await Sales.deleteMany(req.query);
      } else {
         saleDeleted = await Sales.deleteMany({});
      }
      return res.json(saleDeleted);
   } catch (error) {
      console.error(`${error.name}: ${error.message}`);
      return res.status(404).json({error: error.name, message: error.message})
   }
});

module.exports = saleRouter;