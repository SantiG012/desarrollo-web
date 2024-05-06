import { Router, Request, Response, NextFunction } from "express";
import schemaValidator from "../middleware/schema.validator";
import { CategoryUseCases } from "../use-cases";

const router = Router();

const categoryUseCases:CategoryUseCases = new CategoryUseCases();

router.post("/", schemaValidator("/categories"), async (req: Request, res: Response, next: NextFunction) => {
    const category = req.body;

    try {
        res.status(201).send(await categoryUseCases.addCategory(category));
    } catch (error) {
        next(error);
    }
});

router.put("/", schemaValidator("/categories"), async (req: Request, res: Response, next: NextFunction) => {
    const category = req.body;

    try {
        res.status(200).send(await categoryUseCases.editCategory(category));
    } catch (error) {
        next(error);
    }
});

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);

    try {
        res.status(200).send(await categoryUseCases.deleteCategory(id));
    } catch (error) {
        next(error);
    }
});


export default router;