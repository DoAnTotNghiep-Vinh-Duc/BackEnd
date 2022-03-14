import express from 'express';
import { producerController } from '../controllers/ProducerController';
export const producerRouter = express.Router();

producerRouter.get("/producer", producerController.getAllProducer);
producerRouter.get("/producer/:producer_id", producerController.getProducerById);
producerRouter.put("/producer/:producer_id", producerController.updateProducerById);