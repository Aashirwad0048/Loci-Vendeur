import Order from "../models/Order.js";

export const getAnalyticsSummaryData = async () => {
  const [gmvResult, ordersByStatus, ordersByCity, topWholesalers] = await Promise.all([
    Order.aggregate([{ $group: { _id: null, total: { $sum: "$totalAmount" } } }]),
    Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Order.aggregate([{ $group: { _id: "$city", count: { $sum: 1 } } }]),
    Order.aggregate([
      { $group: { _id: "$wholesalerId", revenue: { $sum: "$totalAmount" } } },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
    ]),
  ]);

  return {
    gmv: gmvResult[0]?.total || 0,
    ordersByStatus,
    ordersByCity,
    topWholesalers,
  };
};
