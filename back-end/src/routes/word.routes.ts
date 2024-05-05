import { Router, Request, Response } from "express";

const router = Router();

router.post("/", (req: Request, res: Response) => {
    res.send("Word created");
});

router.put("/", (req: Request, res: Response) => {
    res.send("Word updated");
});

export default router;