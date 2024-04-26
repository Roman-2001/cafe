var tables = require("../models/table");
const asyncHandler = require("express-async-handler");
var async = require('async');



// Показать список всех авторов.
exports.table_list = asyncHandler(async (req, res, next) => {
  tables.find()
    .populate("number")
    .sort("number")
    .then(
      // Successful, so render
      function (list_table) {
        res.render("table", {
          title: "Tables List",
          table_list: list_table,
        }),
      function (err) {
        return next(err);
      }     
    });
});

// Показать подробную страницу для данного автора.
exports.table_detail = function (req, res, next) {
  async.parallel(
    {
      table: function (callback) {
        //tables.findById(req.params.id).exec(callback);
        tables.findById(req.params.id).then(callback);
      },
    
    },
    function (table) {
      /*if (err) {
        return next(err);
      }*/
      if (table == null) {
        // No results.
        var err = new Error("Table not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render

      res.render("table_detail", {
        table: table
      });
    },
  );
};

// Показать форму создания автора по запросу GET.
exports.table_create_get = asyncHandler(async (req, res, next) => {
  res.render("table_form", {title: "Создать новый столик"});
});

// Создать автора по запросу POST.
exports.table_create_post = asyncHandler(async (req, res, next) => {
  tables.find({number: req.body.number}).then(function(result) {
    if (result.length>0) {
      console.log(0);
      var err = new Error("Table with this number already exists");
      res.render("table_form", {title: "Создать новый столик", errors: [err]})
    }
    else { 
      var params = {number: req.body.number, 
                  place: req.body.place, capacity: req.body.capacity,
                };
      var new_table = new tables(params);
      new_table.save();
      res.render("success", {title: "Table is create!"}); 
  }
})
})

// Показать форму удаления автора по запросу GET.
exports.table_delete_get = asyncHandler(async (req, res, next) => {
  tables.findByIdAndDelete(req.params.id).exec();
  res.render("success", {title: "Столик удалён"});
});

// Показать форму обновления автора по запросу GET.
exports.table_update_get = asyncHandler(async (req, res, next) => {
  res.render("table_form", {title: "Изменить данные столика"});
});

// Обновить автора по запросу POST.
exports.table_update_post = asyncHandler(async (req, res, next) => {
  tables.find({number: req.body.number}).then(function(result) {
    if ((result.length>0) && (req.params.id != result[0]._id)) {
      var err = new Error("Table with this number already exists");
      res.render("table_form", {title: "Изменить данные столика", errors: [err]})
    }
    else {
      tables.findByIdAndUpdate(req.params.id, { number: req.body.number, 
                            place: req.body.place, capacity: req.body.capacity,
                            }).exec();
      res.render("success", {title: "Данные столика обновлены"});
    }
  }
)
});
