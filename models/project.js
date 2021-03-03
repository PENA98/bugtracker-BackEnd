const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    },
    lastModified: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Boolean,
        default: true
    },
    modules: [{
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        inCharge: {
            type: Schema.ObjectId,
            ref: "user"
        },
        bugs :[{
            issuedBy: {
                type: Schema.ObjectId,
                ref: "user"
            },
            issuedTo: {
                type: Schema.ObjectId,
                ref: "user"
            },
            title: {
                type: String,
                required: true,
                trim: true
            },
            description: {
                type: String
            },
            created: {
                type: Date,
                default: Date.now
            },
            lastModified: {
                type: Date,
                default: Date.now
            },
            priority: {
                type: String,
                required: true
            },
            status: {
                type: Number,
                default: 1
            },
            image: {
                type: Buffer,
            }
        }]
    }]
})

module.exports = mongoose.model("project", projectSchema);