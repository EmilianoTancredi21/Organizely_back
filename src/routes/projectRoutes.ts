import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import {body, param} from "express-validator"
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { projectExists } from "../middleware/Project";
import { hasAuthorization, taskBelongsToProject, taskExists } from "../middleware/Task";
import { authenticate } from "../middleware/Auth";
import { TeamMemberController } from "../controllers/TeamController";
import { NoteController } from "../controllers/NoteController";

const router = Router();
router.use(authenticate);

router.post("/",
body("projectName").notEmpty().withMessage("El nombre del proyecto es obligatorio"),
body("clientName").notEmpty().withMessage("El nombre del cliente es obligatorio"),
body("description").notEmpty().withMessage("La descripción del proyecto es obligatoria"),
handleInputErrors,
ProjectController.createProject);


router.get("/", ProjectController.getAllProjects );

router.get("/:id", 
param("id").isMongoId().withMessage("Id no válido"),
handleInputErrors,
ProjectController.getProjectById);

router.param('projectId', projectExists) //Para evitar poner el middleware en cada ruta 

router.put('/:projectId',
    param('projectId').isMongoId().withMessage('ID no válido'),
    body('projectName')
        .notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripción del proyecto es obligatoria'),
    handleInputErrors,
    hasAuthorization,
    ProjectController.updateProject
);

router.delete('/:projectId',
    param('projectId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    hasAuthorization,
    ProjectController.deleteProject
);

// Rutas para las tareas
router.post('/:projectId/tasks',
    hasAuthorization,
    body('name')
        .notEmpty().withMessage('El nombre de la tarea es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripción de la tarea es obligatoria'),
    handleInputErrors,
    TaskController.createTask
);

router.get('/:projectId/tasks',
    TaskController.getProjectTasks,
);

router.param('taskId', taskExists);
router.param('taskId', taskBelongsToProject);

router.get('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    TaskController.getTaskById,
);

router.put('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('ID no válido'),
    body('name')
        .notEmpty().withMessage('El nombre de la tarea es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripción de la tarea es obligatoria'),
    handleInputErrors,
    TaskController.updateTask,
);

router.delete('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    TaskController.deleteTask,
);

router.post('/:projectId/tasks/:taskId/status',
    param('taskId').isMongoId().withMessage('ID no válido'),
    body('status')
        .notEmpty().withMessage('El estado es obligatorio'),
    handleInputErrors,
    TaskController.updateStatus,
);

// Rutas para los equipos
router.get('/:projectId/team',
    TeamMemberController.getProjectTeam,
)

router.post('/:projectId/team/find',
    body('email')
        .isEmail().toLowerCase().withMessage('E-mail no válido'),
    handleInputErrors,
    TeamMemberController.findMemberByEmail,
);

router.post('/:projectId/team',
    body('id')
        .isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    TeamMemberController.addMemberById,
);

router.delete('/:projectId/team/:userId',
    param('userId')
        .isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    TeamMemberController.removeMemberById,
);

// Rutas para las notas
router.post('/:projectId/tasks/:taskId/notes',
    body('content')
        .notEmpty().withMessage('El contenido de la nota es obligatorio'),
    handleInputErrors,
    NoteController.createNote,
);

router.get('/:projectId/tasks/:taskId/notes',
    NoteController.getTaskNotes,
);

router.delete('/:projectId/tasks/:taskId/notes/:noteId',
    param('noteId')
        .isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    NoteController.deleteNote,
);


export default router;