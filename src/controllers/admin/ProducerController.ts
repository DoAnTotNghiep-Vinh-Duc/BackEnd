import { ProducerService } from "../../services/admin/ProducerService";
import { Request, Response } from "express";



const getAllProducer = async (req: Request, res: Response): Promise<any> => {
    try {
        ProducerService.getAllProducer((data: any) => {
        res.status(200).send(data);
        });
    
    } catch (error: any) {
        return res.status(500).send({
        msg: error.message,
        });
    }
}

const getProducerById = async (req: Request, res: Response): Promise<any> => {
    try {
        const producerId = req.params.producer_id
        ProducerService.getProducerById(producerId,(data: any) => {
          res.status(200).send(data);
        });
     
    } catch (error: any) {
        return res.status(500).send({
          msg: error.message,
        });
    }
}

const updateProducerById = async (req: Request, res: Response): Promise<any> => {
    try {
        const producerId = req.params.producer_id
        const newProducer = req.body
        ProducerService.updateProducerById(producerId,newProducer, (data: any) => {
          res.status(200).send(data);
        });
     
    } catch (error: any) {
        return res.status(500).send({
          msg: error.message,
        });
    }
}
const producerController = {
    getAllProducer,
    getProducerById,
    updateProducerById
};

export { producerController };
