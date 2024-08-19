const express = require('express')
const { getMessages, addMessage } = require('../controllers/MessageController')

const router = express.Router()

router.post('/', addMessage)
router.get('/:chatId', getMessages)

module.exports = router