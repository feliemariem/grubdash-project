const router = require("express").Router({ mergeParams: true });
const controller = require("./dishes.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router
  .route("/")
  .get(controller.dishList)
  .post(controller.createDish)
  .all(methodNotAllowed);

router 
.route("/:dishId")
.get(controller.readDish)
.put(controller.updateDish)
.all(methodNotAllowed);

module.exports = router;
