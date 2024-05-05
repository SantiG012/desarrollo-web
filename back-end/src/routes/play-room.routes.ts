import { Router, Request, Response } from "express";
import schemaValidator from "../middleware/schema.validator";
import { PlayRoomUseCases } from "../use-cases";

const router = Router();

const playRoomUseCases:PlayRoomUseCases = new PlayRoomUseCases();

router.get("/",
    async (req: Request, res: Response) => {
        const state = req.query.state as string;
        const categoryId = req.query.categoryId as string;
        //TODO: Implemente the logic to filter by state and categoryId
        res.status(200).send(await playRoomUseCases);
    }
);

router.get("/:id/words",
    async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        //TODO: Implemente the logic to get the words of a play room
        res.status(200).send(await playRoomUseCases);
    }
);

router.post("/", 
    schemaValidator("playRoom"),
    async (req: Request, res: Response) => {
        const playRoom = req.body;
        res.status(201).send(await playRoomUseCases.createPlayRoom(playRoom));
    }
);

router.delete("/:id",
    async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        res.status(200).send(await playRoomUseCases.deletePlayRoom(id));
    }
);