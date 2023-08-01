import { Request, Response,} from "express";

export const getAllUsers = (req:Request , res: Response) => {
res.status(200).send({msg: "Get all users"});
}

export const createUsers = (req:Request , res: Response) => {
    const {name, status, year} = req.body;
    if( year > 2021) {
        res.status(400).send( {msg: "Year is invalid"});
        return;
    }

    res.status(201).send( {msg: "User created"});
    
}

export const updateUsers = (req:Request , res: Response) => {
res.status(200).send({msg: "User update"});
}

export const deleteUsers = (req:Request , res: Response) => {
    const {ID} = req.params
res.status(200).send({msg: "User deleted", data: ID});
}