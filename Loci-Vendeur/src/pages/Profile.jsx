import React, { useEffect, useState } from "react";
import ProfileHeader from "../components/Retailer/profile/ProfileHeader";
import ShopInfo from "../components/Retailer/profile/ShopInfo";
import BusinessSettings from "../components/Retailer/profile/BusinessSettings";
import AccountInfo from "../components/Retailer/profile/AccountInfo";
import API from "../api/axios";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    shopName: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    gstNumber: "",
    logo: null,
    defaultTax: 18,
    currency: "₹",
    invoicePrefix: "INV-",
    paymentMethods: { cash: true, upi: true, card: false },
    role: "",
    lastLogin: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get("/users/me");
        const user = response.data?.data || {};
        const retailer = user.retailerDetails || {};

        setFormData((prev) => ({
          ...prev,
          shopName: retailer.shopName || user.shopName || "",
          ownerName: user.name || "",
          email: user.email || "",
          phone: retailer.phone || user.phone || "",
          role: user.role || "",
          address: retailer.address || user.address || "",
          city: retailer.city || user.city || "",
          state: retailer.state || user.state || "",
          pincode: retailer.pincode || user.pincode || "",
          gstNumber: retailer.gstin || user.gstin || "",
          logo: retailer.shopPhoto || user.shopPhoto || prev.logo,
          lastLogin: new Date().toLocaleString(),
        }));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      paymentMethods: { ...formData.paymentMethods, [name]: checked },
    });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, logo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const toggleEdit = async () => {
    if (isEditing) {
      try {
        setSaving(true);
        setError("");
        await API.patch("/users/me", {
          name: formData.ownerName,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          phone: formData.phone,
          shopName: formData.shopName,
          gstin: formData.gstNumber,
          address: formData.address,
          shopPhoto: formData.logo,
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to save profile");
        return;
      } finally {
        setSaving(false);
      }
    }
    setIsEditing(!isEditing);
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 p-8">Loading profile...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-50 p-8 text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <ProfileHeader
          data={formData}
          isEditing={isEditing}
          toggleEdit={toggleEdit}
          onLogoUpload={handleLogoUpload}
        />
        {saving ? <p className="text-sm text-gray-500">Saving profile...</p> : null}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <ShopInfo data={formData} handleChange={handleChange} isEditing={isEditing} />
          </div>

          <div className="lg:col-span-4 space-y-6">
            <BusinessSettings
              data={formData}
              handleChange={handleChange}
              handleCheckboxChange={handleCheckboxChange}
              isEditing={isEditing}
            />

            <AccountInfo data={formData} />
          </div>
        </div>
      </div>
    </div>
  );
}
