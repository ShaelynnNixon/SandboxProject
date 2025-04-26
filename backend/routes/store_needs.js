let express = require('express');
let router = express.Router();
const db = require("./../db");


/**
 * http://localhost:3000/store_needs
 * GET /store_needs
 *
 * @return a list of store needs as JSON
 */
router.get("/store_needs", async (req, res) => {
    try {
        const storeNeeds = await db.getStoreNeeds();  // <- this function
        res.status(200).json(storeNeeds);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to get store needs" });
    }
});

module.exports = router;