import React, { useState } from "react";
import { Plus } from "lucide-react";

const AddItemForm = ({ onAddItem, products = [] }) => {
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemQty, setItemQty] = useState(1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState("");

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(itemName.toLowerCase())
  );

  const selectedProduct = products.find((p) => p.name === itemName);

  const selectProduct = (product) => {
    setItemName(product.name);
    setItemPrice(product.price);
    setItemQty(1);
    setError("");
    setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!itemName || !itemPrice) return;

    const qty = parseInt(itemQty, 10);
    if (!qty || qty < 1) {
      setError("Quantity must be at least 1");
      return;
    }

    if (selectedProduct && qty > Number(selectedProduct.stock || 0)) {
      setError(`Only ${selectedProduct.stock} units in stock`);
      return;
    }

    onAddItem({
      name: itemName,
      price: parseFloat(itemPrice),
      qty,
    });

    // Reset Form
    setItemName("");
    setItemPrice("");
    setItemQty(1);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Plus size={20} className="text-blue-600" /> Add Item
      </h2>
      {error ? <p className="mb-3 text-sm font-semibold text-red-600">{error}</p> : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Search */}
        <div className="relative">
          <label className="text-xs font-semibold text-gray-500 uppercase">Product Name</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search or type name..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
            />
            {showSuggestions && itemName ? (
              filteredProducts.length > 0 ? (
                <div className="absolute z-10 w-full bg-white border rounded-lg shadow-lg mt-1 max-h-40 overflow-y-auto">
                  {filteredProducts.map((p) => (
                    <div
                      key={p.id || p.name}
                      className="p-2 hover:bg-gray-50 cursor-pointer flex justify-between"
                      onClick={() => selectProduct(p)}
                    >
                      <span>{p.name}</span>
                      <span className="text-gray-500 text-sm">₹{p.price} | {p.stock} in stock</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="absolute z-10 w-full bg-white border rounded-lg shadow-lg mt-1 p-2 text-sm text-gray-500">
                  No matching product in your inventory.
                </div>
              )
            ) : null}
          </div>
        </div>

        {/* Price & Qty */}
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="text-xs font-semibold text-gray-500 uppercase">Price</label>
            <input
              type="number"
              placeholder="0.00"
              min="0"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
            />
          </div>
          <div className="w-1/2">
            <label className="text-xs font-semibold text-gray-500 uppercase">Qty</label>
            <input
              type="number"
              min="1"
              max={selectedProduct ? Number(selectedProduct.stock || 1) : undefined}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
              value={itemQty}
              onChange={(e) => setItemQty(e.target.value)}
            />
          </div>
        </div>

        {selectedProduct ? (
          <p className="text-xs text-gray-500">Available stock: {selectedProduct.stock}</p>
        ) : null}

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2"
        >
          Add to Bill
        </button>
      </form>
    </div>
  );
};

export default AddItemForm;
