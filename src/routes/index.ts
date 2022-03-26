import express, { Router } from 'express';
import { authRouter } from './authRouter';
import {AdminRoutes} from './admin/index'
// import { loginFacebookRouter } from './loginFacebookRouter';
export const Routes = express.Router();
Routes.use('/auth', authRouter)
Routes.use('/admin', AdminRoutes);
// Routes.use('/', loginFacebookRouter)