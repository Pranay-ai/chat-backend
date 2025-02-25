import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({
  timestamps: { 
    createdAt: 'createdAt', 
    updatedAt: 'updatedAt'
  },
})
export class BaseSchema {
  // Mongoose automatically creates `_id`, 
  // but if you want it typed here:


  // While not strictly necessary to define these, 
  // it helps with IDE intellisense and type checking.
  createdAt?: Date;
  updatedAt?: Date;
}

// You still need to export the Mongoose SchemaFactory
// if you plan to use this base class directly for a model.

