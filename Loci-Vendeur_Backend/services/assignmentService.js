import Product from "../models/Product.js";
import User from "../models/User.js";
import { geocodeLocation, getDistanceAndDuration } from "./locationService.js";

const normalize = (value) => (value || "").trim().toLowerCase();

export const assignWholesalerByItems = async (items, retailerLocation = {}) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw Object.assign(new Error("Items are required"), { statusCode: 400 });
  }

  const requestedProductIds = items.map((item) => item.productId);
  const requestedProducts = await Product.find({
    _id: { $in: requestedProductIds },
    isActive: true,
  });

  if (requestedProducts.length !== items.length) {
    throw Object.assign(new Error("Some products are invalid or inactive"), { statusCode: 400 });
  }

  const requestedById = new Map(requestedProducts.map((product) => [String(product._id), product]));
  const requestedKeys = items.map((item) => {
    const product = requestedById.get(String(item.productId));
    return {
      quantity: Number(item.quantity),
      nameKey: normalize(product?.name),
    };
  });

  const comparableProducts = await Product.find({
    isActive: true,
    name: { $in: requestedProducts.map((p) => p.name) },
  });

  const byWholesaler = new Map();

  for (const product of comparableProducts) {
    const wholesalerKey = String(product.wholesalerId);
    if (!byWholesaler.has(wholesalerKey)) {
      byWholesaler.set(wholesalerKey, []);
    }
    byWholesaler.get(wholesalerKey).push(product);
  }

  const candidates = [];

  for (const [wholesalerId, products] of byWholesaler.entries()) {
    const productByName = new Map();

    for (const product of products) {
      const key = normalize(product.name);
      if (!key) continue;
      if (!productByName.has(key)) {
        productByName.set(key, []);
      }
      productByName.get(key).push(product);
    }

    const resolvedItems = [];
    let totalCost = 0;
    let canFulfill = true;

    for (const line of requestedKeys) {
      const options = (productByName.get(line.nameKey) || [])
        .filter((option) => option.stock >= line.quantity)
        .sort((a, b) => a.price - b.price);

      const selected = options[0];
      if (!selected) {
        canFulfill = false;
        break;
      }

      resolvedItems.push({
        productId: selected._id,
        quantity: line.quantity,
      });

      totalCost += Number(selected.price) * line.quantity;
    }

    if (!canFulfill || resolvedItems.length !== requestedKeys.length) {
      continue;
    }

    candidates.push({
      wholesalerId,
      resolvedItems,
      totalCost,
    });
  }

  if (candidates.length === 0) {
    throw Object.assign(
      new Error("No nearby wholesaler can fulfill all requested items right now"),
      { statusCode: 400 }
    );
  }

  const wholesalerUsers = await User.find({
    _id: { $in: candidates.map((candidate) => candidate.wholesalerId) },
    role: "wholesaler",
    status: { $in: ["active", "pending"] },
  }).select("city state");
  const userById = new Map(wholesalerUsers.map((user) => [String(user._id), user]));

  const retailerCity = normalize(retailerLocation.city);
  const retailerState = normalize(retailerLocation.state);
  const retailerCoordinates = await geocodeLocation({
    city: retailerLocation.city,
    state: retailerLocation.state,
  });

  const scoredCandidates = await Promise.all(
    candidates.map(async (candidate) => {
      const wholesaler = userById.get(String(candidate.wholesalerId));
      const wholesalerProducts = byWholesaler.get(String(candidate.wholesalerId)) || [];
      const fallbackProductCity = wholesalerProducts.find((p) => p?.city)?.city || "";
      const wholesalerCityRaw = wholesaler?.city || fallbackProductCity;
      const wholesalerCity = normalize(wholesalerCityRaw);
      const wholesalerState = normalize(wholesaler?.state);

      const sameCity = Boolean(retailerCity && wholesalerCity && retailerCity === wholesalerCity);
      const sameState = Boolean(retailerState && wholesalerState && retailerState === wholesalerState);

      const wholesalerCoordinates = await geocodeLocation({
        city: wholesaler?.city,
        state: wholesaler?.state,
      });
      const route = await getDistanceAndDuration({
        from: retailerCoordinates,
        to: wholesalerCoordinates,
      });

      return {
        ...candidate,
        sameCity,
        sameState,
        distanceKm: route.distanceKm,
        wholesalerCity: wholesalerCityRaw || "",
        wholesalerState: wholesaler?.state || "",
      };
    })
  );

  scoredCandidates.sort((a, b) => {
    if (a.sameCity !== b.sameCity) {
      return a.sameCity ? -1 : 1;
    }
    if (a.sameState !== b.sameState) {
      return a.sameState ? -1 : 1;
    }
    if (a.distanceKm !== b.distanceKm) {
      return a.distanceKm - b.distanceKm;
    }
    return a.totalCost - b.totalCost;
  });

  const best = scoredCandidates[0];
  return {
    wholesalerId: best.wholesalerId,
    resolvedItems: best.resolvedItems,
    assignmentDebug: {
      sameCity: best.sameCity,
      sameState: best.sameState,
      distanceKm: Number.isFinite(best.distanceKm) ? best.distanceKm : null,
      totalCost: best.totalCost,
      retailerCity: retailerLocation.city || "",
      retailerState: retailerLocation.state || "",
      wholesalerCity: best.wholesalerCity || "",
      wholesalerState: best.wholesalerState || "",
      rankedBy: ["sameCity", "sameState", "distanceKm", "totalCost"],
    },
  };
};
