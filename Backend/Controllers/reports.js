const { Sales } = require("../Model/models");
const reportsRouter = require("express").Router();

reportsRouter.get("/day", async (req, res) => {
   try {
      let fields = {};
      for (let field in req.query) {
         if (req.query[field]) {
            fields[field] = req.query[field];
         }
      }
      const { year, month, day } = fields;
      const options = {page: parseInt(fields.page) || 1, limit: parseInt(fields.limit) || 6};

      let newAggregate = Sales.aggregate();
      if (day && month && year) {
         newAggregate.match({
            createdAt: {
               $gte: new Date(year, month - 1, day - 1, 20),
               $lt: new Date(year, month - 1, day, 20)
            }
         }).group({
            _id: {
               day: { $dayOfMonth: "$createdAt" }
            },
            totalSales: { $sum: "$total" }
         });
      }
      let result = await Sales.aggregatePaginate(newAggregate, options);
      return res.status(200).json(result);
   } catch (error) {
      console.error(`${error.name}: ${error.message}`);
      return res.status(405).json({error: error.name, message: error.message});
   }
});

reportsRouter.get("/clients", async (req, res) => {
   try {
      let fields = {};
      for (let field in req.query) {
         if (req.query[field]) {
            fields[field] = req.query[field];
         }
      }
      const { year, month } = fields;
      const options = {page: parseInt(fields.page) || 1, limit: parseInt(fields.limit) || 6};

      let newAggregate = Sales.aggregate();
      if (month && year) {
         newAggregate.match({
            createdAt: {
               $gte: new Date(year, month - 1, 1),
               $lt: new Date(year, month, 1)
            }
         }).group({
            _id: "$client",
            totalSales: { $sum: "$total" }
         }).sort({
            totalSales: -1
         });
      } else if (year) {
         newAggregate.match({
            createdAt: {
               $gte: new Date(year, 0, 1),
               $lt: new Date(year + 1, 0, 1)
            }
         }).group({
            _id: "$client",
            totalSales: { $sum: "$total" }
         }).sort({
            totalSales: -1
         });
      }
      let result = await Sales.aggregatePaginate(newAggregate, options);
      return res.status(200).json(result);
   } catch (error) {
      console.error(`${error.name}: ${error.message}`);
      return res.status(405).json({error: error.name, message: error.message});
   }
});

reportsRouter.get("/products", async (req, res) => {
   try {
      let fields = {};
      for (let field in req.query) {
         if (req.query[field]) {
            fields[field] = req.query[field];
         }
      }
      const { year, month } = fields;
      const options = {page: parseInt(fields.page) || 1, limit: parseInt(fields.limit) || 6};

      let newAggregate = Sales.aggregate();
      if (month && year) {
         newAggregate.match({
            createdAt: {
               $gte: new Date(year, month - 1, 1),
               $lt: new Date(year, month, 1)
            }
         }).unwind(
            "$products"
         ).group({
            _id: "$products",
            totalSales: { $sum: "$total" }
         }).sort({
            totalSales: -1
         });
      } else if (year) {
         newAggregate.match({
            createdAt: {
               $gte: new Date(year, 0, 1),
               $lt: new Date(year + 1, 0, 1)
            }
         }).unwind(
            "$products"
         ).group({
            _id: "$products",
            totalSales: { $sum: "$total" }
         }).sort({
            totalSales: -1
         });
      }
      let result = await Sales.aggregatePaginate(newAggregate, options);
      return res.status(200).json(result);
   } catch (error) {
      console.error(`${error.name}: ${error.message}`);
      return res.status(405).json({error: error.name, message: error.message});
   }
});

module.exports = reportsRouter;