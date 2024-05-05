import { Router, Request, Response } from "express";
import schemaValidator from "../middleware/schema.validator";
import { CategoryUseCases } from "../use-cases";

const router = Router();

const categoryUseCases:CategoryUseCases = new CategoryUseCases();

router.post("/", 
    schemaValidator("category"),
    async (req: Request, res: Response) => {
        const category = req.body;
        res.status(201).send(await categoryUseCases.addCategory(category));
    }
);

router.put("/", 
    schemaValidator("category"),
    (req: Request, res: Response) => {
        const category = req.body;
        res.status(200).send(categoryUseCases.editCategory(category));
    }   
);

router.delete("/:id",
    async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        res.status(200).send(await categoryUseCases.deleteCategory(id));
    }
);

export default router;