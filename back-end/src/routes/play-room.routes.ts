import { Router, Request, Response, NextFunction } from "express";
import schemaValidator from "../middleware/schema.validator";
import { PlayRoomUseCases } from "../use-cases";

const router = Router();

const playRoomUseCases:PlayRoomUseCases = new PlayRoomUseCases();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    const state = req.query.state as string;
    const categoryId = req.query.categoryId as string;

    try {
        res.status(200).send(await playRoomUseCases.getPlayRooms(state, parseInt(categoryId)));
    } catch (error) {
        next(error);
    }
});

router.get("/:id/words", async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    
    try {
        res.status(200).send(await playRoomUseCases.getPlayRoomsWords(id));
    } catch (error) {
        next(error);
    }
});

router.post("/", schemaValidator("/play-rooms"), async (req: Request, res: Response, next: NextFunction) => {
    const playRoom = req.body;

    try {
        res.status(201).send(await playRoomUseCases.createPlayRoom(playRoom));
    } catch (error) {
        next(error);
    }
});

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
        res.status(200).send(await playRoomUseCases.deletePlayRoom(id));
    } catch (error) {
        next(error);
    }
});


export default router;