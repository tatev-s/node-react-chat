import {
  Router
} from 'express';
const router = Router();
import UsersController from '../controllers/UsersController';
import MessagesController from '../controllers/MessagesController';
import checkTokenMidleware from '../helpers/verify';


router.post(`/user/login`, UsersController.login);
router.post(`/user/signup`, UsersController.signup);
router.get(`/messages`,checkTokenMidleware, MessagesController.index);
router.post(`/publish`,checkTokenMidleware, MessagesController.publish);
export default router;
