var mongoose = require('mongoose');
// Определяем схему
var Schema = mongoose.Schema;

var DishSchema = new Schema({
  dish_type: {type: String, enum: ["drinkables", "food"]},
  name: {type: String, required: true},
  price: {type: Number, required: true},
  description: {type: String, required: true},
  file_name: {type: String, required: true},
});

DishSchema.virtual("url").get(function () {
    return "/catalog/menu/" + this._id;
})

/*DishSchema.virtual("file").get(function () {
    return "/resources/" + this.file_name;
})*/

// Компилируем модель из схемы
module.exports = mongoose.model("dish", DishSchema);