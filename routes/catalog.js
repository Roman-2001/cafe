var express = require("express");
var router = express.Router();

// Требующиеся модули контроллеров.
var dish_controller = require("../controllers/menu_controller");
var table_controller = require("../controllers/table_controller");
var reserve_controller = require("../controllers/reserve_controller");

/// BOOK ROUTES МАРШРУТЫ КНИГ///

// GET catalog home page.
router.get("/", dish_controller.index);

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
// GET запрос для создания книги. Должен появиться до маршрута, показывающего книгу(использует id)
    router.get("/menu/create", dish_controller.dish_create_get);

// POST request for creating Book.
    router.post("/menu/create", dish_controller.dish_create_post);

// GET request to delete Book.
    router.get("/menu/:id/delete", dish_controller.dish_delete_get);

// GET request to update Book.
    router.get("/menu/:id/update", dish_controller.dish_update_get);

// POST request to update Book.
    router.post("/menu/:id/update", dish_controller.dish_update_post);

    router.get("/table/create", table_controller.table_create_get);

    router.post("/table/create", table_controller.table_create_post);

    router.get("/table/:id/delete", table_controller.table_delete_get);

    router.get("/table/:id/update", table_controller.table_update_get);

    router.post("/table/:id/update", table_controller.table_update_post);
// GET request for one Book.
router.get("/menu/:id", dish_controller.dish_detail);

// GET request for list of all Book items.
router.get("/menu", dish_controller.dish_list);

router.get("/table/:id", table_controller.table_detail);

router.get("/table", table_controller.table_list);

router.get("/table/:id/reservation", reserve_controller.table_reserve_get);

router.get("/table/:id/reservation/cancel", reserve_controller.cancel_table_reserve_get);

router.post("/table/:id/reservation", reserve_controller.table_reserve_post);

router.post("/table/:id/reservation/cancel", reserve_controller.cancel_table_reserve_post);

module.exports = router;
