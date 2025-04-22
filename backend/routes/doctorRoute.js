import express from 'express';
import { doctorList } from '../controllers/doctorControllers.js';

const doctorRoute = express.Router();

doctorRoute.get('/list', doctorList)




export default doctorRoute;