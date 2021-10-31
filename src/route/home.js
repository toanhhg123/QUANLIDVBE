var express = require('express')
var app = express()
var router = express.Router()
const newController = require('../app/controllers/HomeController')
router.get('/data/getif/:id', newController.GetIFTeacher)
router.put('/data/trash/:id', newController.RestoreTeachers)
router.put('/data/:id', newController.UpdateTeacher)
router.post('/data/search', newController.SearchTeacher)
router.delete('/data/deleteall', newController.Action)
router.delete('/data/:id', newController.DeleteTeacher)

router.get('/data/trash', newController.RenderTrash)

router.get('/data/:id', newController.RenderUpdate)
router.get('/data', newController.rederGV)
router.get('', newController.RenderHome)


module.exports = router