import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    size: { type: String, required: true },
    price: { type: Number, required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, default: "" },
    shippingAddress: { type: String, required: true },
    message: { type: String, default: "" },
    paymentMethod: {
      type: String,
      enum: ["bitcoin", "cashapp", "zelle", "applepay"],
      default: "bitcoin",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
