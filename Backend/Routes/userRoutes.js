const userRouter = require("express").Router();
const { Users } = require("../Model/models");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const domain = "http://localhost:3001";

const storage = multer.diskStorage({
   destination: (req, file, callback) => {
      callback(null, "./images/users");
   },
   filename: (req, file, callback) => {
      callback(null, `${Date.now()}_${file.originalname.replace(/\s/g, "_")}`);
   }
});

const upload = multer({ storage: storage });

//Rutas GET

userRouter.get("/", async (req, res) => {
   try {
      let fieldsList = {};
      for (let field in req.query) {
         if (req.query[field]) {
            fieldsList[field] = req.query[field];
         }
      }
      const options = {page: parseInt(fieldsList.page) || 1, limit: parseInt(fieldsList.limit) || 10};
      let query = {deleted: false, role: "client"};
      if (fieldsList.search) {
         const search = fieldsList.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
         query = {
            ...query,
            $or: [
               { firstname: { $regex: search, $options: "i" } },
               { lastname: { $regex: search, $options: "i" } },
               { phone: { $regex: search } },
               { email: { $regex: search, $options: "i" } },
               { address: { $regex: search, $options: "i" } }
            ]
         };
      }
      if (fieldsList.role && fieldsList.role === "admin") {
         delete query.role;
         query = {
            ...query, 
            $or: [
               { role: "vendor" }, 
               { role: "client" }
            ]
         };
      }
      const users = await Users.paginate(query, options);
      return res.status(200).json(users);
   } catch (error) {
      console.error(`${error.name}: ${error.message}`);
      return res.status(405).json({name: error.name, message: error.message});
   }
});

//Rutas POST

userRouter.post("/signup", upload.single("image"), async (req, res) => {
   try {
      const { email } = req.body;
      let user = await Users.findOne({email: email});
      if (user) {
         return res.status(409).json({email: "El correo ya existe"});
      }
      else {
         const salt = await bcrypt.genSalt();
         const hash = await bcrypt.hash(req.body.password, salt);
         user = new Users({...req.body, password: hash});
         if (req.file) {
            user.imageURL = `${domain}/images/users/${req.file.filename}`;
         }
         await user.save();
         return res.status(201).json(user);
      }
   } catch (error) {
      console.error(`${error.name}: ${error.message}`);
      return res.status(400).json({name: error.name, message: error.message});
   }
});

userRouter.post("/login", async (req, res) => {
   const { email, password } = req.body;
   try {
      let user = await Users.findOne({email: email});
      if (user) {
         const match = await bcrypt.compare(password, user.password);
         if (match) {
            const { firstname, lastname, email, role } = user;
            return res.status(200).json({ firstname, lastname, email, role });
         } else {
            return res.status(406).json({ password: "La contraseña es incorrecta" });
         }
      } else {
         return res.status(404).json({ email: "Correo no registrado" });
      }
   } catch (error) {
      console.error(`${error.name}: ${error.message}`);
      return res.status(404).json({name: error.name, message: error.message});
   }
});

//Rutas PATCH

userRouter.patch("/", async (req, res) => {
   try {
      let fieldsList = {};
      for (let field in req.body) {
         if (req.body[field]) {
            fieldsList[field] = req.body[field];
         }
      }
      const user = await Users.findById(fieldsList.id);
      if (!user) {
         return res.status(404).json({user: "Usuario no encontrado"});
      }
      //SOFT Delete
      if (fields.deleted) {
         user.deleted = fields.deleted;
         await user.save();
         return res.status(202).json(user);
      }
      let errors = {};
      const fields = {phone: "El teléfono", email: "El correo", address: "La dirección"};
      for (const field in fieldsList) {
         if (fieldsList[field] === user[field]) {
            errors[field] = `${fields[field]} debe ser diferente`;
         }
         if (field === "password") {
            const match = await bcrypt.compare(fieldsList.password, user.password);
            if (!match) {
               const salt = await bcrypt.genSalt();
               const hash = await bcrypt.hash(fieldsList.password, salt);
               fieldsList.password = hash;
            } else {
               errors.password = `La contraseña debe ser diferente`;
            }
         }
      }
      if (Object.keys(errors).length > 0) {
         return res.status(400).json(errors);
      }
      Object.assign(user, fieldsList);
      await user.save();
      return res.status(202).json(user);
   } catch (error) {
      console.error(`${error.name}: ${error.message}`);
      return res.status(500).json({ name: error.name, message: error.message });
   }
});

//Rutas DELETE para las pruebas en la base de datos

userRouter.delete("/:id", async (req, res) => {
   try {
      let userDeleted = await Users.deleteOne({_id: req.params.id});
      return res.json(userDeleted);
   } catch (error) {
      console.error(`${error.name}: ${error.message}`);
      return res.status(404).json({name: error.name, message: error.message})
   }
});

userRouter.delete("/", async (req, res) => {
   try {
      let query;
      if (req.query.search) {
         const search = req.query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
         query = {
            $or: [
               { firstname: { $regex: search, $options: "i" } },
               { lastname: { $regex: search, $options: "i" } },
               { phone: { $regex: search } },
               { email: { $regex: search, $options: "i" } },
               { address: { $regex: search, $options: "i" } }
            ]
         };
      }
      let userDeleted;
      if (Object.keys(req.query).length > 0) {
         userDeleted = await Users.deleteMany(query);
      } else {
         userDeleted = await Users.deleteMany({});
      }
      return res.json(userDeleted);
   } catch (error) {
      console.error(`${error.name}: ${error.message}`);
      return res.status(404).json({name: error.name, message: error.message})
   }
});

module.exports = userRouter;