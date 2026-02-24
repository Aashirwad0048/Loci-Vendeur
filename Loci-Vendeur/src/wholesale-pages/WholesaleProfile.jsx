import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WholesaleProfileHeader from "../components/Wholesale/profile/WholesaleProfileHeader";
import WholesaleBusinessInfo from "../components/Wholesale/profile/WholesaleBusinessInfo";
import PayoutSettings from "../components/Wholesale/profile/PayoutSettings";
import WholesaleAccountInfo from "../components/Wholesale/profile/WholesaleAccountInfo";
import API from "../api/axios";

export default function WholesaleProfile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    representative: "",
    email: "",
    phone: "",
    warehouseAddress: "",
    warehouseCity: "",
    pincode: "",
    gstin: "",
    logo: null,
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    upiId: "",
    payoutFrequency: "",
    status: "",
    joinedDate: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await API.get('/users/me');
      const user = response.data?.data || {};
      const wholesaler = user.wholesalerDetails || {};

      setFormData((prev) => ({
        ...prev,
        companyName: wholesaler.companyName || prev.companyName,
        representative: user.name || prev.representative,
        email: user.email || prev.email,
        warehouseAddress: wholesaler.warehouseAddress || prev.warehouseAddress,
        warehouseCity: user.city || prev.warehouseCity,
        gstin: wholesaler.gstin || prev.gstin,
        logo: user.shopPhoto || prev.logo,
        accountNumber: wholesaler.bankDetails?.accountNumber || prev.accountNumber,
        ifscCode: wholesaler.bankDetails?.ifsc || prev.ifscCode,
        status: user.status || prev.status,
        joinedDate: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : prev.joinedDate,
      }));
    };

    fetchProfile().catch((e) => console.error(e));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
        await API.patch('/users/me', {
          name: formData.representative,
          city: formData.warehouseCity,
          shopPhoto: formData.logo,
          companyName: formData.companyName,
          gstin: formData.gstin,
          warehouseAddress: formData.warehouseAddress,
          bankDetails: {
            accountNumber: formData.accountNumber,
            ifsc: formData.ifscCode,
          },
        });
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to save profile');
        return;
      } finally {
        setSaving(false);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  const handleChangePassword = () => {
    navigate("/forgot-password");
  };

  return (
    /* pt-28 ensures it sits perfectly below the fixed Navbar */
    <div className="min-h-screen bg-gray-50 pt-28 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <WholesaleProfileHeader 
          data={formData} 
          isEditing={isEditing} 
          toggleEdit={toggleEdit}
          onLogoUpload={handleLogoUpload}
        />
        {saving ? <p className="text-sm text-gray-500">Saving profile...</p> : null}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Business & Warehouse Info */}
          <div className="lg:col-span-8">
            <WholesaleBusinessInfo 
              data={formData} 
              handleChange={handleChange} 
              isEditing={isEditing} 
            />
          </div>

          {/* Bank/Payout & System Metadata */}
          <div className="lg:col-span-4 space-y-6">
            <PayoutSettings 
              data={formData} 
              handleChange={handleChange} 
              isEditing={isEditing} 
            />
            
            <WholesaleAccountInfo
              data={formData}
              onChangePassword={handleChangePassword}
              onLogout={handleLogout}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
