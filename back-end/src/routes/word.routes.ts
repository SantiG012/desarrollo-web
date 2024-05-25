import { Router, Request, Response, NextFunction } from "express";
import schemaValidator from "../middleware/schema.validator";
import { WordUseCases } from "../use-cases";

const router = Router();

const wordUseCases:WordUseCases = new WordUseCases();

router.get("/",
    async (req: Request, res: Response, next:NextFunction) => {
        try {
            res.status(200).send(await wordUseCases.getAllWords());
        } catch (error) {
            next(error);
        }
    }
);

router.post("/", 
    schemaValidator("/words"),
    async (req: Request, res: Response, next:NextFunction) => {
        const word = req.body;

        try {
            res.status(201).send(await wordUseCases.addWord(word));
        } catch (error) {
            next(error);
        }
    }
);

router.put("/", 
    schemaValidator("/words"),
    async (req: Request, res: Response, next:NextFunction) => {
        const word = req.body;
        try {
            res.status(200).send(await wordUseCases.editWord(word));
        } catch (error) {
            next(error);
        }
    }   
);

router.delete("/:id",
    async (req: Request, res: Response, next:NextFunction) => {
        const id = parseInt(req.params.id);

        try {
            res.status(200).send(await wordUseCases.deleteWord(id));
        }catch (error) {
            next(error);
        }
        
    }
);

export default router;