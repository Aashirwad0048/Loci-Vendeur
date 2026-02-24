const mockBills = [
  {
    invoiceNo: 101,
    date: "10 Feb 2026",
    time: "10:30 AM",
    total: 450,
    items: [
      { name: "Milk (1L)", qty: 2, price: 40 },
      { name: "Bread", qty: 1, price: 30 },
      { name: "Eggs (Dozen)", qty: 3, price: 80 }
    ]
  },
  {
    invoiceNo: 102,
    date: "11 Feb 2026",
    time: "11:15 AM",
    total: 1200,
    items: [
      { name: "Rice (5kg)", qty: 2, price: 600 }
    ]
  },
  {
    invoiceNo: 103,
    date: "12 Feb 2026",
    time: "01:00 PM",
    total: 85,
    items: [
      { name: "Chocolate", qty: 5, price: 17 }
    ]
  }
];

export default mockBills;
