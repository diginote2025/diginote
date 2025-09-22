    import express from "express"
    import { deleteTask, recieveTask, sendTask, updateTask } from "../controllers/taskControllers.js"

    const router = express.Router()

    router.post("/", sendTask)
    router.get("/", recieveTask)
    router.delete("/:id", deleteTask)
    router.put("/:id", updateTask)

    export default router