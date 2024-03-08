import  express  from "express";
import controller from "../controller/friends.js";

const router = express.Router()
router
    .route('/')
        .get(controller.getMany)
        .post(controller.addOne)
        .post(controller.addUs)

router
    .route('/login')
        .post(controller.logIn)

router
    .route( '/:id')
        .get(controller.getSingle)
        .patch(controller.editSingle)
router
    .route( '/:name')
        .delete(controller.delSingle);

export default router