const path = require("path");
const dishes = require(path.resolve("src/data/dishes-data"));
const nextId = require("../utils/nextId");

// List of all existing dish data
function dishList(req, res) {
  res.json({ data: dishes});
}

// Get the max id from the dish data
let lastDishId = dishes.reduce((maxId, dish) => Math.max(maxId, dish.id), 0)

// Body has property name validation
function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    next({
      status: 400,
      message: `Must include a ${propertyName}`,
    });
  };
}

// Create new dish
function createDish(req, res) {
  const { data: { name, description, price, image_url } = {} } = req.body;
  const newDish = {
    id: ++lastDishId, // Increment last id then assign as the current ID
    name: name,
    description: description,
    price: price,
    image_url: image_url,
  };
  dishes.push(newDish);
  res.status(201).json({ data: newDish });
}

// Price property validation
function pricePropertyIsValid(req, res, next) {
  const { data: { price } = {} } = req.body;
  if (price <= 0 || !Number.isInteger(price)){
    return next({
      status: 400,
      message: `Dish must have a price that is an integer greater than 0`
    })
  }
  next();
}

// DishId validation
 function validateDishId(req, res, next) {
	const { dishId } = req.params;
	const foundDish = dishes.find((dish) => dish.id === dishId);
   

	if(foundDish) {
		res.locals.dish = foundDish;
		return next();
	} 
   
      next({
		status: 404,
		message: `Dish id does not exist: ${dishId}`,
	})
   
}


// DishBodyId validation
function validateDishBodyId(req, res, next) {
	const { dishId } = req.params;
	const { data: { id } = {} } = req.body;

	if(!id || id === dishId) {
		res.locals.dishId = dishId;
		return next();
	}

	next({
		status: 400,
		message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`
	});
}

// Get dish
function readDish(req, res) {
  res.json({ data: res.locals.dish });
};

// Update dish
function updateDish(req, res) {
  const dish = res.locals.dish;
  
  const { data: { name, description, image_url, price} = {} } = req.body;
  dish.name = name;
  dish.description = description;
  dish.image_url = image_url;
  dish.price = price;
  
  res.json({ data: dish });
}

module.exports = {
  dishList,
  createDish: [
    bodyDataHas("name"),
    bodyDataHas("description"),
    bodyDataHas("price"),
    bodyDataHas("image_url"),
    pricePropertyIsValid,
    createDish
  ],
  readDish: [validateDishId, readDish], 
  updateDish: [
    validateDishId,
    bodyDataHas("name"),
    bodyDataHas("description"),
    bodyDataHas("price"),
    bodyDataHas("image_url"),
    pricePropertyIsValid,
    validateDishBodyId,
    updateDish
  ],
}
