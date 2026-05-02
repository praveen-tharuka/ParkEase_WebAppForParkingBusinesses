import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, Mail, Phone, MapPin, Shield, Edit3, Save, X,
  Camera, Key, Car, Settings, Clock, CheckCircle, AlertCircle,
  Loader2
} from "lucide-react";

const BRAND = "#24d8e0";
const BRAND_LIGHT = "#e8fdfe";
const BRAND_DARK = "#18b8bf";

const InputField = ({ label, field, type = "text", readOnly = false, icon: Icon, isEditMode, formData, errors, onChange }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
      {Icon && <Icon size={11} style={{ color: BRAND }} />}
      {label}
      {!readOnly && <span className="text-red-400">*</span>}
    </label>
    <div className="relative">
      <input
        type={type}
        value={formData[field]}
        onChange={(e) => onChange(field, e.target.value)}
        readOnly={!isEditMode || readOnly}
        style={
          isEditMode && !readOnly && !errors[field]
            ? { borderColor: BRAND, boxShadow: `0 0 0 3px ${BRAND}22` }
            : {}
        }
        className={`w-full px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 outline-none
          ${!isEditMode || readOnly
            ? "bg-gray-50 border-gray-100 text-gray-600 cursor-default"
            : errors[field]
            ? "bg-red-50 border-red-400 text-gray-800"
            : "bg-white text-gray-800"
          }
          ${readOnly ? "opacity-70" : ""}
        `}
      />
      {readOnly && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2">
          <Shield size={13} style={{ color: BRAND }} />
        </span>
      )}
    </div>
    {errors[field] && (
      <p className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
        <AlertCircle size={11} /> {errors[field]}
      </p>
    )}
  </div>
);

const CustomerProfilePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "Nimali",
    lastName: "Perera",
    email: "nimali@example.com",
    phone: "+94 77 123 4567",
    nicNumber: "200112345678",
    street: "123 Galle Road",
    city: "Colombo",
    postalCode: "00300",
    country: "Sri Lanka",
  });

  const [originalData, setOriginalData] = useState({ ...formData });
  const [errors, setErrors] = useState({});

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Enter a valid email";
    if (!/^\+?[\d\s\-]{7,15}$/.test(formData.phone)) newErrors.phone = "Enter a valid phone number";
    if (!formData.street.trim()) newErrors.street = "Street address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    return newErrors;
  };

  const handleEdit = () => { setOriginalData({ ...formData }); setIsEditMode(true); setErrors({}); };

  const handleSave = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsSaving(false); setIsEditMode(false); setErrors({});
    showToast("Profile updated successfully!", "success");
  };

  const handleCancel = () => {
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);
    if (hasChanges) setShowDiscardModal(true);
    else setIsEditMode(false);
  };

  const handleDiscard = () => {
    setFormData({ ...originalData }); setIsEditMode(false); setErrors({}); setShowDiscardModal(false);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const fieldProps = { isEditMode, formData, errors, onChange: handleChange };

  return (
    <div className="min-h-screen py-8 px-4" style={{ background: "linear-gradient(135deg, #f0fffe 0%, #f8f9fa 60%)" }}>

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-white text-sm font-semibold"
          style={{ background: toast.type === "success" ? BRAND : "#ef4444", boxShadow: `0 8px 32px ${toast.type === "success" ? BRAND : "#ef4444"}55` }}>
          {toast.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {toast.message}
        </div>
      )}

      {/* Discard Modal */}
      {showDiscardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-6 w-80 mx-4 border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center">
                <AlertCircle size={20} className="text-orange-500" />
              </div>
              <h3 className="font-bold text-gray-800">Discard Changes?</h3>
            </div>
            <p className="text-sm text-gray-500 mb-5">Your unsaved changes will be lost. Are you sure?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDiscardModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                Keep Editing
              </button>
              <button onClick={handleDiscard}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600">
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto space-y-5">

        {/* Header Card*/}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Banner */}
          <div className="h-28 relative" style={{ background: `linear-gradient(135deg, ${BRAND} 0%, #18b8bf 50%, #0e8f95 100%)` }}>
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.5px)", backgroundSize: "20px 20px" }} />
            {/* Decorative circles */}
            <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-20" style={{ background: "white" }} />
            <div className="absolute top-4 right-16 w-16 h-16 rounded-full opacity-10" style={{ background: "white" }} />
          </div>

          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-14 mb-4">
              {/* Avatar */}
              <div className="relative">
                <div className="w-28 h-28 rounded-2xl border-4 border-white shadow-xl overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${BRAND}, #18b8bf)` }}>
                  {avatarPreview
                    ? <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center">
                        <span className="text-white text-4xl font-bold drop-shadow">
                          {formData.firstName[0]}{formData.lastName[0]}
                        </span>
                      </div>
                  }
                </div>
                {isEditMode && (
                  <>
                    <button onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-1 -right-1 w-9 h-9 rounded-xl flex items-center justify-center shadow-lg transition-all hover:scale-110"
                      style={{ background: BRAND }}>
                      <Camera size={15} className="text-white" />
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mb-2">
                {!isEditMode ? (
                  <button onClick={handleEdit}
                    className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                    style={{ background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})` }}>
                    <Edit3 size={15} /> Edit Profile
                  </button>
                ) : (
                  <>
                    <button onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2.5 border-2 border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all">
                      <X size={15} /> Cancel
                    </button>
                    <button onClick={handleSave} disabled={isSaving}
                      className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-70"
                      style={{ background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})` }}>
                      {isSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-800">{formData.firstName} {formData.lastName}</h1>
                <span className="px-3 py-1 text-xs font-bold rounded-full border"
                  style={{ background: BRAND_LIGHT, color: BRAND_DARK, borderColor: `${BRAND}55` }}>
                  ✓ Active
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-1 flex items-center gap-1.5">
                <Clock size={13} style={{ color: BRAND }} /> Member since January 2024
              </p>
            </div>
          </div>
        </div>

        {/* Personal Info*/}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: BRAND_LIGHT }}>
              <User size={16} style={{ color: BRAND }} />
            </div>
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest">Personal Information</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="First Name" field="firstName" icon={User} {...fieldProps} />
            <InputField label="Last Name" field="lastName" {...fieldProps} />
            <InputField label="Email Address" field="email" type="email" icon={Mail} {...fieldProps} />
            <InputField label="Phone Number" field="phone" type="tel" icon={Phone} {...fieldProps} />
            <InputField label="NIC Number" field="nicNumber" readOnly icon={Shield} {...fieldProps} />
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: BRAND_LIGHT }}>
              <MapPin size={16} style={{ color: BRAND }} />
            </div>
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest">Address</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <InputField label="Street Address" field="street" icon={MapPin} {...fieldProps} />
            <div className="grid grid-cols-2 gap-4">
              <InputField label="City" field="city" {...fieldProps} />
              <InputField label="Postal Code" field="postalCode" {...fieldProps} />
            </div>
            <InputField label="Country / Province" field="country" {...fieldProps} />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: BRAND_LIGHT }}>
              <Settings size={16} style={{ color: BRAND }} />
            </div>
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: Key, label: "Change Password", action: () => navigate("/settings") },
              { icon: Car, label: "My Vehicles", action: () => navigate("/vehicles") },
              { icon: Settings, label: "Account Settings", action: () => navigate("/settings") },
              { icon: Clock, label: "View History", action: () => navigate("/reservations") },
            ].map(({ icon: Icon, label, action }) => (
              <button key={label} onClick={action}
                className="flex flex-col items-center gap-2.5 p-4 rounded-2xl border border-gray-100 hover:border-transparent hover:-translate-y-1 transition-all group text-center"
                style={{ "--hover-bg": BRAND_LIGHT }}
                onMouseEnter={e => e.currentTarget.style.background = BRAND_LIGHT}
                onMouseLeave={e => e.currentTarget.style.background = "white"}>
                <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-white flex items-center justify-center transition-all shadow-sm">
                  <Icon size={17} className="text-gray-400 transition-colors" style={{ color: undefined }}
                    ref={el => { if (el) el.closest('button').addEventListener('mouseenter', () => el.style.color = BRAND); el?.closest('button')?.addEventListener('mouseleave', () => el && (el.style.color = '')); }} />
                </div>
                <span className="text-xs font-semibold text-gray-500 leading-tight group-hover:text-gray-700 transition-colors">{label}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CustomerProfilePage;