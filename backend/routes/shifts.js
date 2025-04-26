let express = require('express');
let router = express.Router();
const db = require("./../db");


/**
 * http://localhost:3000/shifts
 * GET /availability/shifts
 *
 * @return a list of shifts as JSON
 */
router.get(`/shifts`, async (req, res) => {
    try {
        const litOfShifts = await db.getShifts();  // <- this function
        res.status(200).json(litOfShifts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to get shifts" });
    }
});

module.exports = router;