import mongoose, { Schema, Document } from "mongoose";

export interface Conversation extends Document{
  participants: mongoose.Types.ObjectId[];  // Array supports 2+ users
  type: 'direct' | 'group';
  name?: string;            
  description?: string;     
  avatar?: string;         
  createdBy: mongoose.Types.ObjectId;      
  lastMessage?: mongoose.Types.ObjectId;   
  lastActivity: Date;       
  isActive: boolean;       
  createdAt: Date;
  updatedAt: Date;
}