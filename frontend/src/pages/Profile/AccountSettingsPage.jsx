import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield, Bell, Eye, Globe, AlertTriangle, Save, RotateCcw,
  Lock, Mail, MessageSquare, Calendar, CreditCard, Tag,
  EyeOff, CheckCircle, AlertCircle, Loader2, Trash2, ChevronRight, ArrowLeft
} from "lucide-react";

const BRAND = "#24d8e0";
const BRAND_LIGHT = "#e8fdfe";
const BRAND_DARK = "#18b8bf";

const tabs = [
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy", icon: Eye },
  { id: "preferences", label: "Preferences", icon: Globe },
];

const Toggle = ({ checked, onChange }) => (
  <button onClick={() => onChange(!checked)}
    className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none"
    style={{ background: checked ? BRAND : "#e5e7eb" }}>
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200
      ${checked ? "translate-x-6" : "translate-x-1"}`} />
  </button>
);

const ToggleRow = ({ icon: Icon, label, description, checked, onChange }) => (
  <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: BRAND_LIGHT }}>
        <Icon size={15} style={{ color: BRAND }} />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-700">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      </div>
    </div>
    <Toggle checked={checked} onChange={onChange} />
  </div>
);

const AccountSettingsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("security");
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [pwErrors, setPwErrors] = useState({});

  const [notifications, setNotifications] = useState({
    email: true, sms: false, bookingReminders: true,
    paymentConfirmations: true, promotionalEmails: false,
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true, dataSharing: false, activityTracking: true,
  });

  const [preferences, setPreferences] = useState({
    language: "English", timezone: "Asia/Colombo",
    dateFormat: "DD/MM/YYYY", currency: "LKR",
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const getPasswordStrength = (pw) => {
    if (!pw) return { level: 0, label: "", color: "" };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const levels = [
      { level: 0, label: "", color: "#e5e7eb" },
      { level: 1, label: "Weak", color: "#f87171" },
      { level: 2, label: "Fair", color: "#fb923c" },
      { level: 3, label: "Good", color: "#facc15" },
      { level: 4, label: "Strong", color: BRAND },
      { level: 5, label: "Very Strong", color: BRAND_DARK },
    ];
    return levels[score];
  };

  const strength = getPasswordStrength(passwords.new);

  const validatePassword = () => {
    const errs = {};
    if (!passwords.current) errs.current = "Current password is required";
    if (!passwords.new) errs.new = "New password is required";
    else if (passwords.new.length < 8) errs.new = "Password must be at least 8 characters";
    if (passwords.new !== passwords.confirm) errs.confirm = "Passwords do not match";
    return errs;
  };

  const handleChangePassword = async () => {
    const errs = validatePassword();
    if (Object.keys(errs).length > 0) { setPwErrors(errs); return; }
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsSaving(false);
    setPasswords({ current: "", new: "", confirm: "" });
    setPwErrors({});
    showToast("Password changed successfully!");
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSaving(false);
    showToast("Settings saved successfully!");
  };

  const pwField = (key, label, show, setShow, placeholder) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={passwords[key]}
          onChange={(e) => {
            setPasswords((p) => ({ ...p, [key]: e.target.value }));
            setPwErrors((p) => ({ ...p, [key]: "" }));
          }}
          placeholder={placeholder}
          style={!pwErrors[key] ? { borderColor: passwords[key] ? BRAND : "#e5e7eb", boxShadow: passwords[key] ? `0 0 0 3px ${BRAND}22` : "none" } : {}}
          className={`w-full px-4 py-2.5 pr-10 rounded-xl text-sm border transition-all outline-none
            ${pwErrors[key] ? "border-red-400 bg-red-50" : "bg-white border-gray-200"}`}
        />
        <button type="button" onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
      {pwErrors[key] && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={11} />{pwErrors[key]}</p>}
    </div>
  );

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

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-6 w-96 mx-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center">
                <Trash2 size={20} className="text-red-500" />
              </div>
              <h3 className="font-bold text-gray-800">Delete Account</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              This action is <strong>permanent and irreversible</strong>. All your data, reservations, and vehicles will be deleted.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
              <p className="text-xs text-red-600 font-medium">Type <strong>DELETE</strong> to confirm</p>
              <input value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE here"
                className="mt-2 w-full px-3 py-2 rounded-lg border border-red-200 text-sm outline-none focus:ring-2 focus:ring-red-300" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(""); }}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button disabled={deleteConfirmText !== "DELETE"}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button onClick={() => navigate("/profile")}
            className="flex items-center gap-2 text-sm font-semibold mb-4 transition-colors hover:opacity-80"
            style={{ color: BRAND_DARK }}>
            <ArrowLeft size={16} /> Back to Profile
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Account Settings</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your security, notifications and preferences</p>
        </div>

        <div className="flex gap-5 flex-col md:flex-row">
          {/* Sidebar */}
          <div className="md:w-52 flex-shrink-0">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-2">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setActiveTab(id)}
                  className="w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all mb-1 last:mb-0"
                  style={activeTab === id
                    ? { background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})`, color: "white", boxShadow: `0 4px 15px ${BRAND}44` }
                    : { color: "#6b7280" }}>
                  <Icon size={15} />
                  {label}
                  {activeTab !== id && <ChevronRight size={12} className="ml-auto opacity-40" />}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-4">

            {/* Security */}
            {activeTab === "security" && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: BRAND_LIGHT }}>
                    <Lock size={16} style={{ color: BRAND }} />
                  </div>
                  <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest">Change Password</h2>
                </div>
                <div className="space-y-4">
                  {pwField("current", "Current Password", showCurrentPw, setShowCurrentPw, "Enter current password")}
                  {pwField("new", "New Password", showNewPw, setShowNewPw, "At least 8 characters")}

                  {passwords.new && (
                    <div>
                      <div className="flex gap-1.5 mb-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="h-1.5 flex-1 rounded-full transition-all"
                            style={{ background: i <= strength.level ? strength.color : "#f3f4f6" }} />
                        ))}
                      </div>
                      <p className="text-xs font-semibold" style={{ color: strength.color }}>{strength.label}</p>
                    </div>
                  )}

                  {pwField("confirm", "Confirm New Password", showConfirmPw, setShowConfirmPw, "Re-enter new password")}

                  <div className="rounded-2xl p-4" style={{ background: BRAND_LIGHT }}>
                    <p className="text-xs font-bold mb-2" style={{ color: BRAND_DARK }}>Password Requirements</p>
                    {["At least 8 characters", "Uppercase letter (A-Z)", "Lowercase letter (a-z)", "Number (0-9)"].map((req) => {
                      const met = passwords.new && (
                        (req.includes("8") && passwords.new.length >= 8) ||
                        (req.includes("Upper") && /[A-Z]/.test(passwords.new)) ||
                        (req.includes("Lower") && /[a-z]/.test(passwords.new)) ||
                        (req.includes("Number") && /[0-9]/.test(passwords.new))
                      );
                      return (
                        <p key={req} className="text-xs flex items-center gap-2 mb-1.5">
                          <span className="w-4 h-4 rounded-full flex items-center justify-center text-white flex-shrink-0"
                            style={{ background: met ? BRAND : "#d1d5db" }}>
                            <CheckCircle size={9} />
                          </span>
                          <span style={{ color: met ? BRAND_DARK : "#9ca3af" }}>{req}</span>
                        </p>
                      );
                    })}
                  </div>

                  <button onClick={handleChangePassword} disabled={isSaving}
                    className="flex items-center justify-center gap-2 w-full py-3 text-white rounded-2xl text-sm font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-70"
                    style={{ background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})` }}>
                    {isSaving ? <Loader2 size={15} className="animate-spin" /> : <Lock size={15} />}
                    Change Password
                  </button>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === "notifications" && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: BRAND_LIGHT }}>
                    <Bell size={16} style={{ color: BRAND }} />
                  </div>
                  <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest">Notification Preferences</h2>
                </div>
                <p className="text-xs text-gray-400 mb-5 ml-12">Choose how you'd like to be notified</p>
                <ToggleRow icon={Mail} label="Email Notifications" description="Receive updates via email"
                  checked={notifications.email} onChange={(v) => setNotifications((p) => ({ ...p, email: v }))} />
                <ToggleRow icon={MessageSquare} label="SMS Notifications" description="Receive text messages"
                  checked={notifications.sms} onChange={(v) => setNotifications((p) => ({ ...p, sms: v }))} />
                <ToggleRow icon={Calendar} label="Booking Reminders" description="Get reminded before your reservation"
                  checked={notifications.bookingReminders} onChange={(v) => setNotifications((p) => ({ ...p, bookingReminders: v }))} />
                <ToggleRow icon={CreditCard} label="Payment Confirmations" description="Confirm when payment is processed"
                  checked={notifications.paymentConfirmations} onChange={(v) => setNotifications((p) => ({ ...p, paymentConfirmations: v }))} />
                <ToggleRow icon={Tag} label="Promotional Emails" description="Offers, discounts and news"
                  checked={notifications.promotionalEmails} onChange={(v) => setNotifications((p) => ({ ...p, promotionalEmails: v }))} />
              </div>
            )}

            {/* Privacy */}
            {activeTab === "privacy" && (
              <div className="space-y-4">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: BRAND_LIGHT }}>
                      <Eye size={16} style={{ color: BRAND }} />
                    </div>
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest">Privacy Settings</h2>
                  </div>
                  <p className="text-xs text-gray-400 mb-5 ml-12">Control how your data is used</p>
                  <ToggleRow icon={Eye} label="Profile Visibility" description="Allow others to see your profile"
                    checked={privacy.profileVisible} onChange={(v) => setPrivacy((p) => ({ ...p, profileVisible: v }))} />
                  <ToggleRow icon={Shield} label="Data Sharing" description="Share anonymised data to improve services"
                    checked={privacy.dataSharing} onChange={(v) => setPrivacy((p) => ({ ...p, dataSharing: v }))} />
                  <ToggleRow icon={Bell} label="Activity Tracking" description="Track your usage for better recommendations"
                    checked={privacy.activityTracking} onChange={(v) => setPrivacy((p) => ({ ...p, activityTracking: v }))} />
                  <div className="mt-4 pt-4 border-t border-gray-50">
                    <a href="#" className="text-xs font-bold hover:opacity-80 transition-opacity" style={{ color: BRAND }}>
                      View Privacy Policy →
                    </a>
                  </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-red-100 p-6">
                  <h2 className="text-sm font-bold text-red-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <AlertTriangle size={14} /> Danger Zone
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">Permanently delete your ParkEase account and all associated data.</p>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                    <p className="text-xs text-red-600">⚠ This action cannot be undone. All your reservations, vehicles and history will be permanently removed.</p>
                  </div>
                  <button onClick={() => setShowDeleteModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-all">
                    <Trash2 size={15} /> Delete My Account
                  </button>
                </div>
              </div>
            )}

            {/* Preferences */}
            {activeTab === "preferences" && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: BRAND_LIGHT }}>
                    <Globe size={16} style={{ color: BRAND }} />
                  </div>
                  <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest">Preferences</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "Language", key: "language", options: ["English", "Sinhala", "Tamil"] },
                    { label: "Time Zone", key: "timezone", options: ["Asia/Colombo", "Asia/Dubai", "UTC"] },
                    { label: "Date Format", key: "dateFormat", options: ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"] },
                    { label: "Currency", key: "currency", options: ["LKR", "USD", "EUR"] },
                  ].map(({ label, key, options }) => (
                    <div key={key}>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1.5">{label}</label>
                      <select value={preferences[key]}
                        onChange={(e) => setPreferences((p) => ({ ...p, [key]: e.target.value }))}
                        style={{ borderColor: BRAND, boxShadow: `0 0 0 3px ${BRAND}22` }}
                        className="w-full px-4 py-2.5 rounded-xl border text-sm font-medium text-gray-700 bg-white outline-none">
                        {options.map((o) => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Save / Reset */}
            {activeTab !== "security" && (
              <div className="flex gap-3">
                <button onClick={handleSaveSettings} disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-3 text-white rounded-2xl text-sm font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-70"
                  style={{ background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})` }}>
                  {isSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                  Save Settings
                </button>
                <button className="flex items-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-500 rounded-2xl text-sm font-bold hover:bg-gray-50 transition-all">
                  <RotateCcw size={15} /> Reset to Default
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsPage;