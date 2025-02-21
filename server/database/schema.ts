import mongoose, { Document, Schema, model } from "mongoose";
import { generateSKU } from "../src/util";

// Define TypeScript interfaces for models
interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  whatsappNumber?: string;
  role: "admin" | "staff" | "user";
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String },
  whatsappNumber: { type: String },
  role: { type: String, enum: ["admin", "staff", "user"], default: "user" },
  createdAt: { type: Date, default: Date.now },
});

const User = model<IUser>("User", userSchema);

// Product Schema
interface IProduct extends Document {
  name: string;
  sku?: string;
  quantity: number;
  reorderLevel: number;
  supplier: mongoose.Schema.Types.ObjectId;
  createdBy: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  sku: { type: String, unique: true },
  quantity: { type: Number, required: true, default: 0 },
  reorderLevel: { type: Number, required: true },
  supplier: { type: Schema.Types.ObjectId, ref: "Supplier" },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

// Pre-save hook to generate SKU
productSchema.pre<IProduct>("save", function (next) {
  if (!this.sku) {
    this.sku = generateSKU(this.name);
  }
  next();
});

const Product = model<IProduct>("Product", productSchema);

// Stock Alert Schema
interface IStockAlert extends Document {
  product: mongoose.Schema.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
  alertType: "email" | "sms" | "whatsapp";
  sentAt: Date;
}

const alertSchema = new Schema<IStockAlert>({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  alertType: { type: String, enum: ["email", "sms", "whatsapp"], required: true },
  sentAt: { type: Date, default: Date.now },
});

const StockAlert = model<IStockAlert>("StockAlert", alertSchema);

// Supplier Schema
interface ISupplier extends Document {
  name: string;
  contactEmail: string;
  phone?: string;
  address?: string;
  createdAt: Date;
}

const supplierSchema = new Schema<ISupplier>({
  name: { type: String, required: true },
  contactEmail: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Supplier = model<ISupplier>("Supplier", supplierSchema);

// Order Schema
interface IOrder extends Document {
  product: mongoose.Schema.Types.ObjectId;
  quantity: number;
  type: "sale" | "restock";
  transactionDate: Date;
}

const orderSchema = new Schema<IOrder>({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  type: { type: String, enum: ["sale", "restock"], required: true },
  transactionDate: { type: Date, default: Date.now },
});

const Order = model<IOrder>("Order", orderSchema);

// Invoice Schema
interface IInvoiceProduct {
  product: mongoose.Schema.Types.ObjectId;
  quantity: number;
  price: number;
}

interface IInvoice extends Document {
  customerName: string;
  customerEmail?: string;
  products: IInvoiceProduct[];
  totalAmount: number;
  status: "pending" | "paid";
  issuedDate: Date;
}

const invoiceSchema = new Schema<IInvoice>({
  customerName: { type: String, required: true },
  customerEmail: { type: String },
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "paid"], default: "pending" },
  issuedDate: { type: Date, default: Date.now },
});

const Invoice = model<IInvoice>("Invoice", invoiceSchema);

// User Settings Schema
interface IUserSettings extends Document {
  user: mongoose.Schema.Types.ObjectId;
  preferredNotifications: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
  };
  createdAt: Date;
}

const settingsSchema = new Schema<IUserSettings>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  preferredNotifications: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    whatsapp: { type: Boolean, default: false },
  },
  createdAt: { type: Date, default: Date.now },
});

const UserSettings = model<IUserSettings>("UserSettings", settingsSchema);


// Define Receipt interface
interface IReceipt extends Document {
  invoice: mongoose.Types.ObjectId;
  amountPaid: number;
  paymentMethod: "cash" | "bank transfer" | "card" | "mobile money";
  transactionId?: string; // Optional for digital payments
  receivedBy?: mongoose.Types.ObjectId; // Staff who processed the payment
  issuedDate: Date;
}

// Define Receipt Schema
const receiptSchema = new Schema<IReceipt>({
  invoice: { type: Schema.Types.ObjectId, ref: "Invoice", required: true },
  amountPaid: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ["cash", "bank transfer", "card", "mobile money"],
    required: true,
  },
  transactionId: { type: String, unique: true, sparse: true }, // Optional, only for online payments
  receivedBy: { type: Schema.Types.ObjectId, ref: "User" }, // Optional, tracks who processed payment
  issuedDate: { type: Date, default: Date.now },
});

// Create and export Receipt model
const Receipt = model<IReceipt>("Receipt", receiptSchema);

export { User, UserSettings, Supplier, Invoice, Order, StockAlert, Product, Receipt };
