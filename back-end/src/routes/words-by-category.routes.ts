import { Router, Request, Response } from "express";
import schemaValidator from "../middleware/schema.validator";
import { WordsByCategoryUseCases } from "../use-cases";

const router = Router();

const wordsByCategoryUseCases:WordsByCategoryUseCases = new WordsByCategoryUseCases();

router.post("/", 
    schemaValidator("wordsByCategory"),
    async (req: Request, res: Response) => {
        const wordsByCategory = req.body;
        res.status(201).send(await wordsByCategoryUseCases.associateWordWithCategory(wordsByCategory));
    }
);

router.delete("/",
    schemaValidator("wordsByCategory"),
    async (req: Request, res: Response) => {
       const wordsByCategory = req.body;
       res.status(200).send(await wordsByCategoryUseCases.disassociateWordWithCategory(wordsByCategory));
    }
);

export default router;