import express, { Router } from 'express';
import { authRouter } from './authRouter';
import {AdminRoutes} from './admin/index'
// import { loginFacebookRouter } from './loginFacebookRouter';
export const Routes = express.Router();
Routes.use('/', authRouter)
Routes.use('/', AdminRoutes);
// Routes.use('/', loginFacebookRouter)