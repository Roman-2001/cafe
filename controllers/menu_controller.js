var dishes = require("../models/dish");
var tables = require("../models/table")
const asyncHandler = require("express-async-handler");
var async = require('async');

exports.index = asyncHandler(async (req, res, next) => { 
  const [
    num_dish,
    num_tables,
    num_available_tables,
  ] = await Promise.all([
    dishes.countDocuments({}).exec(),
    tables.countDocuments({}).exec(),
    tables.countDocuments({state:'Available'}).exec()
  ]);

  res.render("index", {
    title: "Home",
    dish_count: num_dish,
    table_count: num_tables,
    table_available_count: num_available_tables,
  });
});

// Показать список всех авторов.
exports.dish_list = asyncHandler(async (req, res, next) =>  {
  dishes.find({}, "name")
    .populate("price")
    .populate("description")
    .populate("file_name")
    .then(
      //Successful, so render
      function (list_dishes) {
        res.render("menu", { title: "Dish List", dish_list: list_dishes });
      },
      //error
      function (err) { 
        return next(err);
      }      
    );
});

// Показать подробную страницу для данного автора.
exports.dish_detail = function (req, res, next) {
  async.parallel(
    {
      dish: function (callback) {
        //tables.findById(req.params.id).exec(callback);
        dishes.findById(req.params.id).then(callback);
      },
    
    },
    function (dish) {
      /*if (err) {
        return next(err);
      }*/
      console.log(dish);
      if (dish == null) {
        // No results.
        var err = new Error("Dish not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render

      res.render("dish_detail", {
        dish: dish
      });
    },
  );
};

// Показать форму создания автора по запросу GET.
exports.dish_create_get = asyncHandler(async (req, res, next) =>  {
  res.render("dish_form", {title: "Создать новое блюдо"});
});

// Создать автора по запросу POST.
exports.dish_create_post = asyncHandler(async (req, res, next) =>  {
    dishes.find({name: req.body.name}).then(function(result) {
    if (result.length>0) {
      //console.log(0);
      var err = new Error("Dish with this name already exists");
      res.render("dish_form", {title: "Создать новое блюдо", errors: [err]})
    }
    else { 
      var params = {dish_type: req.body.dish_type, name: req.body.name, 
        price: req.body.price, description: req.body.description,
        file_name: req.body.file_name,
      };
      var new_dish = new dishes(params);
      new_dish.save();
      res.render("success", {title: "Dish is create!"}); 
    }
  })
})
    

// Показать форму удаления автора по запросу GET.
exports.dish_delete_get = asyncHandler(async (req, res, next) =>  {
  dishes.findByIdAndDelete(req.params.id).exec();
  res.render("success", {title: "Блюдо удалёно"});
});

// Показать форму обновления автора по запросу GET.
exports.dish_update_get = asyncHandler(async (req, res, next) => {
  res.render("dish_form", {title: "Изменить данные блюда"});
});

// Обновить автора по запросу POST.
exports.dish_update_post = asyncHandler(async (req, res, next) => {
  dishes.find({name: req.body.name}).then(function(result) {
    if ((result.length>0) && (req.params.id != result[0]._id)) {
      var err = new Error("Dish with this name already exists");
      res.render("dish_form", {title: "Изменить данные блюда", errors: [err]})
    }
    else {
      dishes.findByIdAndUpdate(req.params.id, { name: req.body.name, 
                            price: req.body.price, description: req.body.description,
                            file_name: req.body.file_name, dish_type: req.body.dish_type}).exec();
      res.render("success", {title: "Данные блюда обновлены"});
    }
  }
)
});
