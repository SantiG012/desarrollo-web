import { Router, Request, Response } from "express";
import schemaValidator from "../middleware/schema.validator";
import { WordUseCases } from "../use-cases";

const router = Router();

const wordUseCases:WordUseCases = new WordUseCases();

router.post("/", 
    schemaValidator("word"),
    async (req: Request, res: Response) => {
        const word = req.body;
        res.status(201).send(await wordUseCases.addWord(word));
    }
);

router.put("/", 
    schemaValidator("word"),
    (req: Request, res: Response) => {
        const word = req.body;
        res.status(200).send(wordUseCases.editWord(word));
    }   
);

export default router;