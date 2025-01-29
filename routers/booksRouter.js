const express = require("express");
const router = express.Router();
const {
    index,
    destroy,
    show,
    storeReviews,
    destroyReviews,
    store,
} = require("../controllers/booksController");

// index
router.get("/", index);

// show
router.get("/:id", show);

// store
router.post("/", store);

// storeReviews
router.post("/:id", storeReviews);

//
router.delete("/:id/:review_id", destroyReviews);

// destroy
router.delete("/:id", destroy);


module.exports = router;
