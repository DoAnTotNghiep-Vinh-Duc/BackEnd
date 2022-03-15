import express from 'express';
import { ProducerController } from '../../controllers/admin/ProducerController';
export const producerRouter = express.Router();

producerRouter.get("/producer", ProducerController.getAllProducer);
producerRouter.get("/producer/:producer_id", ProducerController.getProducerById);
producerRouter.put("/producer/:producer_id", ProducerController.updateProducerById);
producerRouter.post("/producer", ProducerController.createProducer);