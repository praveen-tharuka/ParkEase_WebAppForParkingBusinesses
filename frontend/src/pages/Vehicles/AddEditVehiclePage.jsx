import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, Car, Upload, X, CheckCircle, AlertCircle,
  Loader2, Trash2, Save, PlusCircle, Image
} from "lucide-react";

const BRAND = "#24d8e0";
const BRAND_LIGHT = "#e8fdfe";
const BRAND_DARK = "#18b8bf";

const VEHICLE_TYPES = ["Car", "Motorcycle", "Van", "SUV", "Truck"];
const BRANDS = ["Toyota", "Honda", "Nissan", "Suzuki", "Mitsubishi", "BMW", "Mercedes", "Hyundai", "Kia", "Ford", "Other"];
const COLORS = [
  { label: "Black", value: "#111827" },
  { label: "White", value: "#f9fafb" },
  { label: "Silver", value: "#9ca3af" },
  { label: "Red", value: "#dc2626" },
  { label: "Blue", value: "#1a56db" },
  { label: "Green", value: "#16a34a" },
  { label: "Yellow", value: "#ca8a04" },
  { label: "Orange", value: "#ea580c" },
  { label: "Brown", value: "#92400e" },
  { label: "Other", value: "#6b7280" },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 30 }, (_, i) => currentYear - i);

const AddEditVehiclePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const fileInputRef = useRef(null);

  // --- Original Logic Kept Exactly Same ---
  const initial = isEditMode
    ? { id: 1, number: "CAB-1234", type: "Car", brand: "Toyota", model: "Corolla", color: "#1a56db", year: 2020, image: null }
    : { number: "", type: "", brand: "", model: "", color: "#111827", year: currentYear, image: null };

  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingAnother, setIsSavingAnother] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [toast, setToast] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState(false);

  const MOCK_EXISTING_PLATES = ["CAR-5678", "CAT-9012"];

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const validate = () => {
    const errs = {};
    if (!form.number.trim()) errs.number = "Vehicle number is required";
    else if (!/^[A-Z]{2,3}-?\d{4}$/i.test(form.number.trim()))
      errs.number = "Enter a valid plate number (e.g. CAB-1234)";
    if (!form.type) errs.type = "Vehicle type is required";
    if (!form.brand) errs.brand = "Brand is required";
    if (!form.model.trim()) errs.model = "Model is required";
    return errs;
  };

  const handleChange = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
    if (field === "number") {
      setDuplicateWarning(MOCK_EXISTING_PLATES.includes(value.trim().toUpperCase()));
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (saveAnother = false) => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    if (duplicateWarning) return;
    saveAnother ? setIsSavingAnother(true) : setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1200));
    if (saveAnother) {
      setIsSavingAnother(false);
      setForm({ number: "", type: "", brand: "", model: "", color: "#111827", year: currentYear, image: null });
      setImagePreview(null);
      showToast("Vehicle added! You can add another one.", "success");
    } else {
      setIsSaving(false);
      showToast(isEditMode ? "Vehicle updated successfully!" : "Vehicle added successfully!");
      setTimeout(() => navigate("/vehicles"), 1200);
    }
  };

  // --- UI Components with your new theme ---
  return (
    <div className="min-h-screen py-8 px-4" style={{ background: "linear-gradient(135deg, #f0fffe 0%, #f8f9fa 60%)" }}>
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-white text-sm font-semibold"
          style={{ background: toast.type === "success" ? BRAND : "#ef4444" }}>
          {toast.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {toast.message}
        </div>
      )}

      {/* Modals Kept as per your original logic */}
      {showDiscardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm border border-gray-100 shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-500"><AlertCircle size={20} /></div>
              <h3 className="font-bold text-gray-800">Discard Changes?</h3>
            </div>
            <p className="text-sm text-gray-500 mb-6">Your unsaved changes will be lost.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDiscardModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-500">Keep Editing</button>
              <button onClick={() => navigate("/vehicles")} className="flex-1 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-bold">Discard</button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setShowDiscardModal(true)} className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm">
            <ArrowLeft size={18} style={{ color: BRAND_DARK }} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{isEditMode ? "Edit Vehicle" : "Add New Vehicle"}</h1>
            <p className="text-xs text-gray-400 mt-0.5">{isEditMode ? "Update your vehicle details" : "Register a new vehicle to your account"}</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Main Details Card */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-6 sm:p-8">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Car size={14} style={{ color: BRAND }} /> Vehicle Information
            </h2>

            <div className="space-y-5">
              {/* Plate Number */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Vehicle Number <span className="text-red-400">*</span></label>
                <input
                  value={form.number}
                  onChange={(e) => handleChange("number", e.target.value.toUpperCase())}
                  placeholder="e.g. CAB-1234"
                  className={`w-full px-5 py-3 rounded-2xl text-sm font-bold tracking-widest border transition-all outline-none focus:ring-4 focus:ring-cyan-50
                    ${errors.number ? "border-red-400 bg-red-50" : duplicateWarning ? "border-orange-400 bg-orange-50" : "border-gray-100 focus:border-cyan-400 bg-gray-50 focus:bg-white"}`}
                />
                {errors.number && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1"><AlertCircle size={11} /> {errors.number}</p>}
                {duplicateWarning && !errors.number && <p className="text-[10px] text-orange-500 font-bold flex items-center gap-1 mt-1"><AlertCircle size={11} /> Already registered in your account.</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Type Selection */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Vehicle Type <span className="text-red-400">*</span></label>
                  <select value={form.type} onChange={(e) => handleChange("type", e.target.value)}
                    className="w-full px-5 py-3 rounded-2xl text-sm font-bold border border-gray-100 bg-gray-50 focus:bg-white focus:border-cyan-400 outline-none transition-all">
                    <option value="">Select type</option>
                    {VEHICLE_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                  {errors.type && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.type}</p>}
                </div>

                {/* Year Selection */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Manufactured Year</label>
                  <select value={form.year} onChange={(e) => handleChange("year", parseInt(e.target.value))}
                    className="w-full px-5 py-3 rounded-2xl text-sm font-bold border border-gray-100 bg-gray-50 focus:bg-white focus:border-cyan-400 outline-none transition-all">
                    {YEARS.map(y => <option key={y}>{y}</option>)}
                  </select>
                </div>

                {/* Brand Selection */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Brand <span className="text-red-400">*</span></label>
                  <select value={form.brand} onChange={(e) => handleChange("brand", e.target.value)}
                    className="w-full px-5 py-3 rounded-2xl text-sm font-bold border border-gray-100 bg-gray-50 focus:bg-white focus:border-cyan-400 outline-none transition-all">
                    <option value="">Select brand</option>
                    {BRANDS.map(b => <option key={b}>{b}</option>)}
                  </select>
                  {errors.brand && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.brand}</p>}
                </div>

                {/* Model Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Model <span className="text-red-400">*</span></label>
                  <input value={form.model} onChange={(e) => handleChange("model", e.target.value)} placeholder="e.g. Corolla"
                    className="w-full px-5 py-3 rounded-2xl text-sm font-bold border border-gray-100 bg-gray-50 focus:bg-white focus:border-cyan-400 outline-none transition-all" />
                  {errors.model && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.model}</p>}
                </div>
              </div>

              {/* Color Picker Kept Exact Logic */}
              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Vehicle Color</label>
                <div className="flex flex-wrap gap-2.5">
                  {COLORS.map(({ label, value }) => (
                    <button key={value} onClick={() => handleChange("color", value)} title={label}
                      className={`w-9 h-9 rounded-2xl border-4 transition-all hover:scale-110
                        ${form.color === value ? "border-cyan-400 scale-110 shadow-lg" : "border-transparent shadow-sm"}`}
                      style={{ backgroundColor: value }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Image Upload Card */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-6">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Image size={14} style={{ color: BRAND }} /> Vehicle Image <span className="normal-case font-medium text-gray-300">(optional)</span>
            </h2>

            {imagePreview ? (
              <div className="relative group">
                <img src={imagePreview} className="w-full h-44 object-cover rounded-[1.5rem] border border-gray-100" alt="preview" />
                <button onClick={() => setImagePreview(null)} className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-red-600">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-100 rounded-[1.5rem] p-8 text-center cursor-pointer hover:border-cyan-200 hover:bg-cyan-50 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-2"><Upload size={20} className="text-gray-300" /></div>
                <p className="text-sm font-bold text-gray-500">Click to upload photo</p>
                <p className="text-[10px] text-gray-400 mt-1">PNG, JPG up to 5MB</p>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-5">
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => handleSave(false)} disabled={isSaving || isSavingAnother}
                className="flex-1 py-3.5 text-white rounded-2xl text-sm font-bold shadow-lg transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                style={{ background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})` }}>
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {isSaving ? "Saving..." : isEditMode ? "Update Vehicle" : "Save Vehicle"}
              </button>

              {!isEditMode && (
                <button onClick={() => handleSave(true)} disabled={isSaving || isSavingAnother}
                  className="flex-1 py-3.5 border-2 border-cyan-400 text-cyan-500 rounded-2xl text-sm font-bold hover:bg-cyan-50 transition-all flex items-center justify-center gap-2">
                  {isSavingAnother ? <Loader2 size={16} className="animate-spin" /> : <PlusCircle size={16} />}
                  Save & Add Another
                </button>
              )}

              <button onClick={() => setShowDiscardModal(true)} className="px-6 py-3.5 border border-gray-100 text-gray-500 rounded-2xl text-sm font-bold hover:bg-gray-50 transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditVehiclePage;