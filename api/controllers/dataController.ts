import { Request, Response } from 'express';


export let index = (req:Request, res:Response) => {
    return res.end("test");
}

export let newdata = (callback:any) => {
    return (req:Request, res:Response) => {
        console.log(`data: ${JSON.stringify(req.body)}`);
        callback(req.body);
        return res.end("thanks");
    }
}