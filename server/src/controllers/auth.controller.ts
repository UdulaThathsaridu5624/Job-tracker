import type{ Request, Response } from "express";
import { loginUser, registerUser } from "../services/auth.service.js";

export async function register(req:Request,res:Response){
    try{
        const {name,email,password} = req.body;
        const user = await registerUser(name,email,password);
        res.status(201).json(user);
    } catch (error : any) {
        res.status(400).json({error:error.message});
    }
}

export async function login(req:Request,res:Response){
    try{
        const {email,password} = req.body;
        const result = await loginUser(email,password);
        res.status(200).json(result);
    } catch (error : any) {
        res.status(400).json({error:error.message});
    }
}