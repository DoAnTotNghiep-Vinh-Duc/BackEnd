import express, { Router } from 'express';
import { authRouter } from './authRouter';
import {producerRouter} from './producerRouter'
// import { loginFacebookRouter } from './loginFacebookRouter';
export const Routes = express.Router();
Routes.use('/', authRouter)
Routes.use('/', producerRouter);
// Routes.use('/', loginFacebookRouter)