import { Router } from 'express';

import { TaskController } from '../controllers/task.controller';
import { authenticate } from '../middlewares/auth';

const taskRouter = Router();
const taskController = new TaskController();

taskRouter.use(authenticate);

taskRouter.post('/', taskController.createTask);

taskRouter.get('/', taskController.getTasks);

taskRouter.get('/:id', taskController.getTaskById);
taskRouter.put('/:id', taskController.updateTask);

taskRouter.delete('/:id', taskController.deleteTask);

export default taskRouter;
