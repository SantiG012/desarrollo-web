import { Router, Request, Response, NextFunction } from "express";
import schemaValidator from "../middleware/schema.validator";
import { WordsByCategoryUseCases } from "../use-cases";

const router = Router();

const wordsByCategoryUseCases:WordsByCategoryUseCases = new WordsByCategoryUseCases();

router.post("/", 
    schemaValidator("/words-by-category"),
    async (req: Request, res: Response, next:NextFunction) => {
        const wordsByCategory = req.body;

        try{
            res.status(201).send(await wordsByCategoryUseCases.associateWordWithCategory(wordsByCategory));
        } catch (error) {
            next(error);
        }
        
    }
);

router.delete("/:id",
    schemaValidator("/words-by-category"),
    async (req: Request, res: Response,next:NextFunction) => {
       const id = parseInt(req.params.id);
       try{
        res.status(200).send(await wordsByCategoryUseCases.disassociateWordWithCategory(id));
    } catch (error) {
        next(error);
    }
    }
);

export default router;