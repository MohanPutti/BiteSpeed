import { contactIdentity } from "../controllers/contact/contact.controller.js";
import express from 'express';
import { contactRoutes } from "./contact.router.js";
const allRoutes = (app) => {
    console.log("came here");
    app.use('/',contactRoutes)
};

export default allRoutes;

