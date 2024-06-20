import mongoose, { Schema, Document } from 'mongoose';

export interface VMOptionsDocument extends Document {
  name: string;
  iso: string;
  ram: string;
  disk: string;
  cpu: string;
  network: string;
  osVariant: string;
  bootOption: string;
  arch: string;
  username: string;
  password: string;
}

const vmOptionsSchema: Schema<VMOptionsDocument> = new Schema({
  name: { type: String, required: true },
  iso: { type: String, default: 'koompi' },
  ram: { type: String, default: '1024' },
  disk: { type: String, default: '20G' },
  cpu: { type: String, default: '1' },
  network: { type: String, default: 'default' },
  osVariant: { type: String, default: 'archlinux' },
  bootOption: { type: String, default: 'uefi' },
  arch: { type: String, default: 'x64' },
  username: { type: String, default: 'admin' },
  password: { type: String, default: '123' },
}, { timestamps: true });

export default mongoose.model<VMOptionsDocument>('vms', vmOptionsSchema);
