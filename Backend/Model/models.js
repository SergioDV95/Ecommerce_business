const mongoose = require("mongoose");
const Paginate = require("mongoose-paginate-v2");
const Aggregate = require("mongoose-aggregate-paginate-v2");

function time() {
   const UTC = new Date();
   const diff = UTC.getTimezoneOffset();
   const localtime = new Date(UTC.getTime() - (diff * 60 * 1000));
   return localtime;
}

const UserSchema = mongoose.Schema({
   imageURL: {
      type: String,
      minlength: 1,
      maxlength: 1000,
   },
   firstname: {
      type: String,
      minlength: 1,
      maxlength: 100,
      required: true
   },
   lastname: {
      type: String,
      minlength: 1,
      maxlength: 100,
      required: true
   },
   phone: {
      type: String,
      minlength: 1,
      maxlength: 20,
   },
   email: {
      type: String,
      minlength: 1,
      maxlength: 100,
      required: true
   },
   password: {
      type: String,
      minlength: 1,
      maxlength: 100,
      required: true
   },
   role: {
      type: String,
      default: "client",
      minlength: 1,
      maxlength: 20,
   },
   address: {
      type: String,
      minlength: 1,
      maxlength: 1000,
      required: true
   },
   deleted: {
      type: Boolean,
      default: false
   },
   createdAt: {
      type: Date,
      default: () => time()
   },
   updateAt: {
      type: Date,
      default: () => time() 
   }
});
UserSchema.pre("save", function (next) {
   this.updateAt = time();   
   next();
})
UserSchema.plugin(Paginate);

const ProductSchema = mongoose.Schema({
   imageURL: {
      type: String,
      minlength: 1,
      maxlength: 1000,
   },
   name: {
      type: String,
      minlength: 1,
      maxlength: 100,
      required: true
   },
   price: {
      type: Number,
      min: 0.01,
      required: true
   },
   stock: {
      type: Number,
      min: 1,
      required: true
   },
   description: {
      type: String,
      minlength: 1,
      maxlength: 2000,
      required: true
   },
   category: {
      type: String,
      minlength: 1,
      maxlength: 100,
      required: true
   },
   deleted: {
      type: Boolean,
      default: false,
   },
   createdAt: {
      type: Date,
      default: () => time()
   },
   updateAt: {
      type: Date,
      default: () => time()
   }
});
ProductSchema.pre("save", function (next) {
   this.updateAt = time();   
   next();
})
ProductSchema.plugin(Paginate);

const SaleSchema = mongoose.Schema({
   client: {
      type: String,
      required: true
   },
   vendor: {
      type: String,
      required: true
   },
   products: {
      type: [String],
      required: true
   },
   subtotal: {
      type: Number,
      required: true
   },
   tax: {
      type: Number,
      required: true
   },
   total: {
      type: Number,
      required: true
   },
   deleted: {
      type: Boolean,
      default: false
   },
   createdAt: {
      type: Date,
      default: () => time()
   },
   updateAt: {
      type: Date,
      default: () => time()
   }
});
SaleSchema.pre("save", function (next) {
   this.updateAt = time();   
   next();
})
SaleSchema.plugin(Paginate);
SaleSchema.plugin(Aggregate);

const Users = mongoose.model("Users", UserSchema);
const Products = mongoose.model("Products", ProductSchema);
const Sales = mongoose.model("Sales", SaleSchema);

module.exports = { Users, Products, Sales };