const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/', expenseController.addExpense);

module.exports = router;