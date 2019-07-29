import {
  Router
} from 'express';
const router = Router();
import UsersController from '../controllers/UsersController';
import DashboardController from '../controllers/DashboardController';
import ChatsController from '../controllers/ChatsController';
import AppController from '../controllers/AppController';
const userCntrl = new UsersController();
const dashboardCntrl = new DashboardController();
const appCntrl = new AppController();
const chatsCntrl = new ChatsController();

router.route('/').get(dashboardCntrl.index);
router.route('/user/signin').get(userCntrl.login).post(userCntrl.login);
router.route('/user/signup').get(userCntrl.signup).post(userCntrl.signup);
router.route('/user/logout').get(userCntrl.logout);
router.route('/dashboard').get(dashboardCntrl.index);
router.route('/chats').get(chatsCntrl.index);
router.route('/chats/tree').get(chatsCntrl.tree);
router.route('/chats/create/:adminid').get(chatsCntrl.create);
router.route('/chats/messages/:chatid').get(chatsCntrl.messages);
router.route('*').get(appCntrl.notfound);

export default router;
