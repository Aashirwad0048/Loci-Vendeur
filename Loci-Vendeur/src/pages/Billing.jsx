import React, { useState, useRef, useEffect } from "react";
import { Printer, RefreshCw } from "lucide-react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

import AddItemForm from "../components/Retailer/billing/AddItemForm";
import BillAdjustments from "../components/Retailer/billing/BillAdjustments";
import ReceiptPreview from "../components/Retailer/billing/ReceiptPreview";

const Billing = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [invoiceDate, setInvoiceDate] = useState(new Date());
  const [invoiceNum, setInvoiceNum] = useState(`INV-${Math.floor(Math.random() * 10000)}`);
  const [billId, setBillId] = useState(null);
  const [savingBill, setSavingBill] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  
  const [discountPercent, setDiscountPercent] = useState(0);
  const [taxPercent, setTaxPercent] = useState(5);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [cashReceived, setCashReceived] = useState("");
  const [inventoryProducts, setInventoryProducts] = useState([]);
  const [shopInfo, setShopInfo] = useState({
    shopName: "Store",
    ownerName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    gstin: "",
  });

  const componentRef = useRef();

  const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * taxPercent) / 100;
  const total = Math.round(taxableAmount + taxAmount);

  const calculations = {
    subtotal,
    discountAmount,
    discountPercent,
    taxAmount,
    taxPercent,
    total
  };

  const handleAddItem = (newItem) => {
    setItems([...items, { ...newItem, id: Date.now() }]);
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleReset = () => {
    if (window.confirm("Start a new bill? Current data will be lost.")) {
      setItems([]);
      setCashReceived("");
      setInvoiceNum(`INV-${Math.floor(Math.random() * 10000)}`);
      setInvoiceDate(new Date());
      setDiscountPercent(0);
      setBillId(null);
      setSaveMessage("");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveBill = async () => {
    if (items.length === 0) {
      setSaveMessage("Add at least one item before saving.");
      return;
    }

    try {
      setSavingBill(true);
      setSaveMessage("");

      const payload = {
        invoiceNumber: invoiceNum,
        invoiceDate: invoiceDate.toISOString(),
        items: items.map((item) => ({
          name: item.name,
          qty: Number(item.qty),
          price: Number(item.price),
          lineTotal: Number(item.qty) * Number(item.price),
        })),
        subtotal: calculations.subtotal,
        discountPercent: calculations.discountPercent,
        discountAmount: calculations.discountAmount,
        taxPercent: calculations.taxPercent,
        taxAmount: calculations.taxAmount,
        total: calculations.total,
        paymentMethod,
        paymentStatus: "paid",
        cashReceived: Number(cashReceived || 0),
      };

      const response = await API.post("/bills", payload);
      const bill = response.data?.data;

      if (bill?._id) {
        setBillId(bill._id);
        setSaveMessage(`Bill saved (${bill.invoiceNumber}).`);
      } else {
        setSaveMessage("Bill saved.");
      }
    } catch (error) {
      setSaveMessage(error.response?.data?.message || "Failed to save bill");
    } finally {
      setSavingBill(false);
    }
  };

  // Clock Timer
  useEffect(() => {
    const timer = setInterval(() => setInvoiceDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
        const response = await API.get("/users/me");
        const user = response.data?.data || {};
        const retailer = user.retailerDetails || {};

        setShopInfo({
          shopName: retailer.shopName || user.shopName || "Store",
          ownerName: user.name || "",
          phone: retailer.phone || user.phone || "",
          address: retailer.address || user.address || "",
          city: retailer.city || user.city || storedUser.city || "",
          state: retailer.state || user.state || "",
          pincode: retailer.pincode || user.pincode || "",
          gstin: retailer.gstin || user.gstin || "",
        });
      } catch {
        // keep safe fallback values if profile is unavailable
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchRetailInventory = async () => {
      try {
        const response = await API.get("/orders?limit=100&status=delivered");
        const orders = response.data?.data || [];

        const inventoryMap = new Map();

        for (const order of orders) {
          for (const item of order.items || []) {
            const id = item.productId?._id || item.productId;
            const name = item.productId?.name || "Product";
            if (!id || !name) continue;

            if (!inventoryMap.has(String(id))) {
              inventoryMap.set(String(id), {
                id: String(id),
                name,
                price: Number(item.price || 0),
                stock: 0,
              });
            }

            const existing = inventoryMap.get(String(id));
            existing.stock += Number(item.quantity || 0);
          }
        }

        setInventoryProducts(Array.from(inventoryMap.values()));
      } catch {
        setInventoryProducts([]);
      }
    };

    fetchRetailInventory();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        
        <div className="w-full lg:w-5/12 space-y-6 no-print">
          <AddItemForm onAddItem={handleAddItem} products={inventoryProducts} />
          
          <BillAdjustments 
            taxPercent={taxPercent}
            setTaxPercent={setTaxPercent}
            discountPercent={discountPercent}
            setDiscountPercent={setDiscountPercent}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            cashReceived={cashReceived}
            setCashReceived={setCashReceived}
            total={total}
          />
        </div>

        <div className="w-full lg:w-7/12 flex flex-col h-full">
          <div className="flex justify-between items-center mb-4 no-print">
            <h2 className="text-xl font-bold text-gray-800">Preview</h2>
            <div className="flex gap-2">
              <button
                onClick={handleSaveBill}
                disabled={savingBill}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:bg-emerald-700 shadow-md transition disabled:opacity-60"
              >
                {savingBill ? "Saving..." : "Save Bill"}
              </button>
              <button
                onClick={handleReset}
                className="bg-white border text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:bg-red-50 hover:text-red-600 transition"
              >
                <RefreshCw size={16} /> New Bill
              </button>
              <button
                onClick={handlePrint}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:bg-blue-700 shadow-md transition"
              >
                <Printer size={16} /> Print Receipt
              </button>
            </div>
          </div>
          {saveMessage ? <p className="mb-3 text-sm font-medium text-gray-600">{saveMessage}</p> : null}
          {billId ? (
            <button
              onClick={() => navigate(`/receipt/${billId}`)}
              className="mb-3 text-sm text-blue-600 hover:underline no-print"
            >
              View saved receipt
            </button>
          ) : null}

          {/* Receipt Component */}
          <ReceiptPreview 
            ref={componentRef}
            items={items}
            handleDeleteItem={handleDeleteItem}
            invoiceDate={invoiceDate}
            invoiceNum={invoiceNum}
            paymentMethod={paymentMethod}
            calculations={calculations}
            shopInfo={shopInfo}
          />
        </div>
      </div>

      {/* Global print style */}
      <style>
        {`
          @media print {
            body { background: white; -webkit-print-color-adjust: exact; }
            .no-print { display: none !important; }
            .print-area {
              display: block !important;
              position: absolute;
              top: 0; left: 0;
              width: 100%; max-width: 100% !important;
              box-shadow: none !important;
              margin: 0; padding: 20px;
            }
            @page { margin: 0; }
          }
        `}
      </style>
    </div>
  );
};

export default Billing;
