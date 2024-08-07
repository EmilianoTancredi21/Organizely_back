import mongoose, {Schema, Document, Types} from "mongoose";
import Note from "./Note";

const statusTask = {
    PENDING: "pending",
    ON_HOLD: "onHold",
    IN_PROGRESS: "inProgress",
    UNDER_REVIEW: "underReview",
    COMPLETED: "completed"
} as const

export type statusTask = typeof statusTask[keyof typeof statusTask]

//ESTO ES PARA TYPESCRIPT
export interface ITask extends Document {
    name: string,
    description: string,
    project: Types.ObjectId
    status: statusTask
    completedBy: {
        user: Types.ObjectId,
        status: statusTask,
    }[];
    notes: Types.ObjectId[];
}


//ESTO ES PARA MONGOOSE
export const TaskSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    project: {
        type: Types.ObjectId,
        ref: "Project"
    },
    status:{
        type: String,
        enum: Object.values(statusTask),
        default: statusTask.PENDING
    },
    completedBy: [
        {
            user: {
                type: Types.ObjectId,
                ref: 'User',
                default: null,
            },
            status: {
                type: String,
                enum: Object.values(statusTask),
                default: statusTask.PENDING,
            }
        }
    ],
    notes: [
        {
            type: Types.ObjectId,
            ref: 'Note',
        }
    ]
}, {timestamps: true})


// Middleware
TaskSchema.pre('deleteOne', { document: true }, async function () {
    const taskId = this._id;
    if (!taskId) return;
    await Note.deleteMany({ task: taskId });
})

const Task = mongoose.model<ITask>("Task", TaskSchema);
export default Task;