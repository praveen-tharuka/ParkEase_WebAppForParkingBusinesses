import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Car, Plus, Search, Filter, Edit3, Trash2, CheckCircle,
  AlertCircle, Loader2, Bike, Truck, X, ArrowLeft
} from "lucide-react";

const BRAND = "#24d8e0";
const BRAND_LIGHT = "#e8fdfe";
const BRAND_DARK = "#18b8bf";

const VEHICLE_TYPE_ICONS = { Car, Motorcycle: Bike, Van: Car, SUV: Car, Truck };

const TYPE_COLORS = {
  Car: "bg-blue-50 text-blue-600 border-blue-200",
  SUV: "bg-green-50 text-green-600 border-green-200",
  Van: "bg-purple-50 text-purple-600 border-purple-200",
  Motorcycle: "bg-orange-50 text-orange-600 border-orange-200",
  Truck: "bg-gray-50 text-gray-600 border-gray-200",
};


const MOCK_VEHICLES = [
  { id: 1, number: "CAB-1234", type: "Car", brand: "Toyota", model: "Corolla", color: "#1a56db", year: 2020 },
  { id: 2, number: "CAR-5678", type: "SUV", brand: "Honda", model: "CR-V", color: "#16a34a", year: 2022 },
  { id: 3, number: "CAT-9012", type: "Motorcycle", brand: "Yamaha", model: "FZ-S", color: "#dc2626", year: 2021 },
  { id: 4, number: "WP-CAS-1234", type: "Car", brand: "Toyota", model: "Vitz", color: "#9ca3af", year: 2018 },
  { id: 5, number: "WP-CAD-5678", type: "SUV", brand: "Honda", model: "Vezel", color: "#1a56db", year: 2016 },
  { id: 6, number: "WP-CBE-9012", type: "Van", brand: "Suzuki", model: "Wagon R", color: "#111827", year: 2019 },
  { id: 7, number: "WP-CAY-3456", type: "Truck", brand: "Nissan", model: "Leaf", color: "#f9fafb", year: 2020 },
  { id: 8, number: "CP-KA-7890", type: "SUV", brand: "Mitsubishi", model: "Montero", color: "#ca8a04", year: 2015 },
  { id: 9, number: "WP-CAH-2233", type: "Car", brand: "Mazda", model: "Axela", color: "#1a56db", year: 2017 },
  { id: 10, number: "WP-CBF-1122", type: "Car", brand: "Perodua", model: "Bezza", color: "#dc2626", year: 2020 },
];

const VehicleManagementPage = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState(MOCK_VEHICLES);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = vehicles
    .filter((v) => {
      const matchSearch = v.number.toLowerCase().includes(search.toLowerCase()) ||
        v.brand.toLowerCase().includes(search.toLowerCase()) ||
        v.model.toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === "All" || v.type === filterType;
      return matchSearch && matchType;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return b.year - a.year;
      if (sortBy === "oldest") return a.year - b.year;
      if (sortBy === "az") return a.brand.localeCompare(b.brand);
      return 0;
    });

  const handleDelete = async () => {
    setIsDeleting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setVehicles((prev) => prev.filter((v) => v.id !== deleteTarget.id));
    setIsDeleting(false);
    setDeleteTarget(null);
  };

  return (
    <div className="min-h-screen py-8 px-4" style={{ background: "linear-gradient(135deg, #f0fffe 0%, #f8f9fa 60%)" }}>
      <div className="max-w-3xl mx-auto">
        {/* Navigation */}
        <button onClick={() => navigate("/profile")} className="flex items-center gap-2 text-sm font-bold mb-6 transition-all hover:opacity-70" style={{ color: BRAND_DARK }}>
          <ArrowLeft size={16} /> Back to Profile
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Vehicles</h1>
            <p className="text-sm text-gray-400 mt-1">{vehicles.length} vehicle{vehicles.length !== 1 ? "s" : ""} registered</p>
          </div>
          <button onClick={() => navigate("/vehicles/add")}
            className="flex items-center gap-2 px-5 py-3 text-white rounded-2xl text-sm font-bold shadow-lg transition-all hover:-translate-y-1"
            style={{ background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})` }}>
            <Plus size={18} /> Add Vehicle
          </button>
        </div>

        {/* Search & Filter Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by plate number, brand..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-100 text-sm focus:border-cyan-400 outline-none transition-all"
              />
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center w-12 h-12 rounded-2xl border transition-all ${showFilters ? "border-cyan-400 bg-cyan-50 text-cyan-500" : "border-gray-100 text-gray-400"}`}>
              <Filter size={18} />
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-50 space-y-4">
              <div className="flex flex-wrap gap-2">
                {["All", "Car", "SUV", "Van", "Motorcycle", "Truck"].map((type) => (
                  <button key={type} onClick={() => setFilterType(type)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all border ${filterType === type ? "bg-cyan-500 text-white border-cyan-500" : "border-gray-100 text-gray-500 hover:border-cyan-200"}`}>
                    {type}
                  </button>
                ))}
              </div>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-48 px-4 py-2 rounded-xl border border-gray-100 text-xs font-bold text-gray-500 outline-none">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="az">Brand A-Z</option>
              </select>
            </div>
          )}
        </div>

        {/* Vehicle List */}
        <div className="space-y-4">
          {filtered.map((v) => {
            const Icon = VEHICLE_TYPE_ICONS[v.type] || Car;
            return (
              <div key={v.id} className="bg-white rounded-[2rem] p-5 border border-gray-50 shadow-sm flex items-center gap-5 group hover:border-cyan-200 transition-all">
                {/* Icon Container */}
                <div className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center flex-shrink-0 shadow-inner" 
                     style={{ background: `${v.color}15` }}>
                  <Icon size={28} style={{ color: v.color }} />
                </div>

                {/* Details */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-black text-gray-800 tracking-wider text-base">{v.number}</span>
                    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${TYPE_COLORS[v.type] || TYPE_COLORS.Car}`}>
                      {v.type}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm font-medium">{v.brand} {v.model} • {v.year}</p>
                  
                  {/* Color Circle Logic (Restored) */}
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="w-3 h-3 rounded-full border border-gray-200 shadow-sm" style={{ backgroundColor: v.color }} />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{v.color}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button onClick={() => navigate(`/vehicles/edit/${v.id}`)} className="p-3 rounded-2xl bg-gray-50 text-gray-400 hover:text-cyan-500 hover:bg-cyan-50 transition-all">
                    <Edit3 size={18} />
                  </button>
                  <button onClick={() => setDeleteTarget(v)} className="p-3 rounded-2xl bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm border border-gray-100 shadow-2xl">
            <h3 className="font-bold text-gray-800 text-lg mb-2">Remove Vehicle?</h3>
            <p className="text-sm text-gray-500 mb-6">Are you sure you want to remove <b>{deleteTarget.number}</b>?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-3 rounded-xl border border-gray-200 font-bold text-gray-500">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold flex items-center justify-center gap-2">
                {isDeleting ? <Loader2 size={18} className="animate-spin" /> : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleManagementPage;