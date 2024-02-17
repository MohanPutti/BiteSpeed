import express from 'express';
import { contactIdentity } from '../controllers/contact/contact.controller.js';

const route = express.Router();
route.post('/identify', contactIdentity);

export { route as contactRoutes };
