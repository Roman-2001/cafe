var mongoose = require('mongoose');
var moment = require("moment");
// Определяем схему
var Schema = mongoose.Schema;

var TableSchema = new Schema({
  number: {type: Number, required: true},
  capacity: {type: Number, required: true},
  place: {type: String, required: true},
  state: {type: String, required: true, 
            enum: ["Available", "Occupied","Reserved"], default: "Available"},
  date_occupied: {type: [], default: []}
});

TableSchema.virtual("url").get(function () {
    return "/catalog/table/" + this._id.toString();
})

TableSchema.virtual("date_occupied_formatted").get(function(){
  dates = [];
  for (d of this.date_occupied) {
    dates.push(moment(d).format('DD-MM-YYYY HH:mm'));
  }
  return dates;
})

// Компилируем модель из схемы
module.exports = mongoose.model("table", TableSchema);
