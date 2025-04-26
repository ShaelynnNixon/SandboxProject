let express = require('express');
let router = express.Router();
const db = require("./../db");


/**
 * http://localhost:3000/availability/{employee_id}
 * GET /availability/{employee_id}
 *
 * @return the availability of a specific employee as JSON
 */
router.get(`/availability/:id`, async (req, res) => {
    const id = req.params.id;

    try {
        const availability = await db.getEmployeeAvailability(id);  // <- this function
        res.status(200).json(availability);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to get employees" });
    }
});

module.exports = router;