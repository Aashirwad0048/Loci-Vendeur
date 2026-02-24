import { releaseEscrowForOrder } from "../services/escrowService.js";
import { formatResponse } from "../utils/formatResponse.js";

export const releaseEscrow = async (req, res) => {
  const data = await releaseEscrowForOrder(req.params.orderId);
  return res.json(formatResponse({ message: "Escrow released", data }));
};
