import Product from "../models/Product.js";
import User from "../models/User.js";
import { geocodeLocation, getDistanceAndDuration } from "../services/locationService.js";
import { formatResponse } from "../utils/formatResponse.js";

const normalize = (value) => (value || "").trim().toLowerCase();

export const getProducts = async (req, res) => {
  const includeInactive = req.query.includeInactive === "true";
  const nearby = req.query.nearby === "true";
  const filters = {};

  if (!includeInactive) {
    filters.isActive = true;
  }

  if (req.query.city) {
    filters.city = req.query.city;
  }

  if (req.query.wholesalerId) {
    filters.wholesalerId = req.query.wholesalerId;
  }

  // Only admins or the product owner can include inactive records.
  if (includeInactive) {
    const isAdmin = req.user?.role === "admin";
    const isOwner =
      req.user?.role === "wholesaler" && String(req.user?.id) === String(req.query.wholesalerId || "");
    if (!isAdmin && !isOwner) {
      filters.isActive = true;
    }
  }

  const products = await Product.find(filters)
    .populate("wholesalerId", "name city")
    .sort({ createdAt: -1 });

  let shaped = products.map((product) => {
    const obj = product.toObject();
    const wholesalerDoc = product.wholesalerId && typeof product.wholesalerId === "object" ? product.wholesalerId : null;
    const wholesalerName = wholesalerDoc?.name || "Wholesaler";
    const wholesalerCity = wholesalerDoc?.city || obj.city;
    return {
      ...obj,
      wholesalerName,
      wholesalerCity,
      wholesaler: {
        id: wholesalerDoc?._id || obj.wholesalerId || null,
        name: wholesalerName,
        city: wholesalerCity,
      },
    };
  });

  if (nearby && req.user?.role === "retailer") {
    const retailer = await User.findById(req.user.id).select("city state");
    const retailerCity = normalize(retailer?.city);
    const retailerState = normalize(retailer?.state);
    const retailerCoordinates = await geocodeLocation({
      city: retailer?.city || "",
      state: retailer?.state || "",
    });

    const wholesalerIds = [
      ...new Set(
        shaped
          .map((item) => item.wholesaler?.id)
          .filter(Boolean)
          .map((id) => String(id))
      ),
    ];

    const wholesalerUsers = await User.find({
      _id: { $in: wholesalerIds },
      role: "wholesaler",
    }).select("city state");
    const wholesalerById = new Map(wholesalerUsers.map((u) => [String(u._id), u]));

    const firstProductByWholesaler = new Map();
    for (const item of shaped) {
      const key = String(item.wholesaler?.id || "");
      if (key && !firstProductByWholesaler.has(key)) {
        firstProductByWholesaler.set(key, item);
      }
    }

    const nearbyByWholesalerId = new Map();
    await Promise.all(
      Array.from(firstProductByWholesaler.entries()).map(async ([wholesalerId, sampleItem]) => {
        const wholesalerUser = wholesalerById.get(wholesalerId);
        const wholesalerCityRaw = wholesalerUser?.city || sampleItem.wholesaler?.city || sampleItem.city || "";
        const wholesalerStateRaw = wholesalerUser?.state || "";

        const sameCity =
          Boolean(retailerCity) && Boolean(normalize(wholesalerCityRaw)) && retailerCity === normalize(wholesalerCityRaw);
        const sameState =
          Boolean(retailerState) &&
          Boolean(normalize(wholesalerStateRaw)) &&
          retailerState === normalize(wholesalerStateRaw);

        const wholesalerCoordinates = await geocodeLocation({
          city: wholesalerCityRaw,
          state: wholesalerStateRaw,
        });

        const route = await getDistanceAndDuration({
          from: retailerCoordinates,
          to: wholesalerCoordinates,
        });

        nearbyByWholesalerId.set(wholesalerId, {
          sameCity,
          sameState,
          distanceKm: Number.isFinite(route.distanceKm) ? route.distanceKm : null,
          source: route.source || null,
        });
      })
    );

    shaped = shaped.map((item) => ({
      ...item,
      nearbyDebug: nearbyByWholesalerId.get(String(item.wholesaler?.id || "")) || {
        sameCity: false,
        sameState: false,
        distanceKm: null,
        source: null,
      },
    }));

    shaped.sort((a, b) => {
      const as = a.nearbyDebug || {};
      const bs = b.nearbyDebug || {};

      if (as.sameCity !== bs.sameCity) return as.sameCity ? -1 : 1;
      if (as.sameState !== bs.sameState) return as.sameState ? -1 : 1;

      const ad = Number.isFinite(as.distanceKm) ? as.distanceKm : Number.POSITIVE_INFINITY;
      const bd = Number.isFinite(bs.distanceKm) ? bs.distanceKm : Number.POSITIVE_INFINITY;
      if (ad !== bd) return ad - bd;

      return Number(a.price || 0) - Number(b.price || 0);
    });
  }

  return res.json(formatResponse({ data: shaped }));
};

export const createProduct = async (req, res) => {
  const { name, category, price, stock, minOrderQty, city, image } = req.body;

  const product = await Product.create({
    wholesalerId: req.user.id,
    name,
    category: category || "",
    price,
    stock,
    minOrderQty: Number(minOrderQty) || 1,
    city,
    image: image || null,
  });

  return res.status(201).json(formatResponse({ message: "Product created", data: product }));
};

export const updateProduct = async (req, res) => {
  const { name, category, price, stock, minOrderQty, city, isActive, flagged, image } = req.body;

  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json(formatResponse({ success: false, message: "Product not found" }));
  }

  const isOwner = String(product.wholesalerId) === String(req.user.id);
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return res.status(403).json(formatResponse({ success: false, message: "Forbidden" }));
  }

  if (name !== undefined) product.name = name;
  if (category !== undefined) product.category = category;
  if (price !== undefined) product.price = price;
  if (stock !== undefined) product.stock = stock;
  if (minOrderQty !== undefined) product.minOrderQty = Number(minOrderQty) || 1;
  if (city !== undefined) product.city = city;
  if (isActive !== undefined) product.isActive = isActive;
  if (flagged !== undefined) product.flagged = flagged;
  if (image !== undefined) product.image = image;

  await product.save();

  return res.json(formatResponse({ message: "Product updated", data: product }));
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json(formatResponse({ success: false, message: "Product not found" }));
  }

  const isOwner = String(product.wholesalerId) === String(req.user.id);
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return res.status(403).json(formatResponse({ success: false, message: "Forbidden" }));
  }

  await product.deleteOne();

  return res.json(formatResponse({ message: "Product deleted" }));
};

export const updateProductStatus = async (req, res) => {
  const { isActive, flagged } = req.body;

  const product = await Product.findByIdAndUpdate(req.params.id, { isActive, flagged }, { new: true });
  if (!product) {
    return res.status(404).json(formatResponse({ success: false, message: "Product not found" }));
  }

  return res.json(formatResponse({ message: "Product status updated", data: product }));
};
