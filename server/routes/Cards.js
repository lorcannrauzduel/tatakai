module.exports = app => {
  const CardController = require("../controllers/CardController.js");
  var router = require("express").Router();

  router.post("/", CardController.create);
  router.get("/", CardController.findAll);
  router.get("/:id", CardController.findOne);
  router.post("/buy", CardController.buy);
  router.post("/sale", CardController.putForSale);

  app.use('/api/cards', router);
};