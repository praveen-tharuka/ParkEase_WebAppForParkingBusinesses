function ReservationForm() {
  return (
    <div style={styles.container}>

      {/* Step Indicator */}
      <div style={styles.steps}>
        <span>Slot</span>
        <span style={styles.activeStep}>Details</span>
        <span>Confirm</span>
        <span>Success</span>
      </div>
      <p style={styles.stepText}>Step 2 of 4</p>

      <div style={styles.layout}>
        {/* Main Form */}
        <div style={styles.formCard}>
          <h1 style={styles.pageTitle}>Reservation Details</h1>

          {/* Date & Time */}
          <h2 style={styles.sectionTitle}>Date & Time</h2>

          <label style={styles.label}>
            Check-in Date <span style={styles.required}>*</span>
          </label>
          <input type="date" style={styles.input} />
          <p style={styles.warning}>Selected date must be available</p>

          <label style={styles.label}>
            Check-in Time <span style={styles.required}>*</span>
          </label>
          <input type="time" style={styles.input} />

          <label style={styles.label}>Duration (hours)</label>
          <select style={styles.input}>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
          </select>

          {/* Vehicle */}
          <h2 style={styles.sectionTitle}>Vehicle</h2>
          <select style={styles.input}>
            <option>Select vehicle</option>
            <option>CAR - WP CAB 1234</option>
          </select>

          {/* Terms */}
          <h2 style={styles.sectionTitle}>Terms & Policies</h2>
          <label>
            <input type="checkbox" /> I agree to the{" "}
            <span style={styles.link}>Terms & Conditions</span>
          </label>

          <ul style={styles.policyList}>
            <li>Free cancellation up to 1 hour before check-in</li>
            <li>15-minute grace period for late arrival</li>
          </ul>

          {/* Actions */}
          <div style={styles.actions}>
            <button style={styles.secondaryBtn}>Previous</button>
            <button style={styles.secondaryBtn}>Cancel</button>
            <button style={styles.secondaryBtn}>Save as Draft</button>
            <button style={styles.primaryBtn}>
              Proceed to Confirm
            </button>
          </div>
        </div>

        {/* Slot Summary */}
        <div style={styles.slotCard}>
          <h3>Selected Slot</h3>
          <div style={styles.slotImage}>[ Slot Image ]</div>
          <p><strong>Slot:</strong> A12</p>
          <p><strong>Location:</strong> City Center</p>
          <p style={styles.link}>Change Slot</p>
        </div>
      </div>
    </div>
  );
}
const styles = {
  container: {
    padding: "30px",
    backgroundColor: "#f9fafb",
  },
  steps: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    fontWeight: "600",
  },
  activeStep: {
    color: "#2dd4d4",
  },
  stepText: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#666",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "20px",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  formCard: {
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
  },
  slotCard: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "12px",
    position: "sticky",
    top: "20px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
    height: "fit-content",
  },
  slotImage: {
    height: "100px",
    backgroundColor: "#eee",
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  pageTitle: {
    fontSize: "28px",
    fontWeight: "700",
  },
  sectionTitle: {
    marginTop: "20px",
    borderBottom: "2px solid #2dd4d4",
    paddingBottom: "5px",
  },
  label: {
    display: "block",
    marginTop: "10px",
  },
  required: {
    color: "red",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginTop: "5px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  warning: {
    fontSize: "12px",
    color: "#d97706",
  },
  policyList: {
    marginTop: "10px",
    fontSize: "14px",
  },
  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "25px",
    flexWrap: "wrap",
  },
  primaryBtn: {
    backgroundColor: "#2dd4d4",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
  },
  secondaryBtn: {
    backgroundColor: "transparent",
    color: "#2dd4d4",
    border: "2px solid #2dd4d4",
    padding: "10px 15px",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
  },
  link: {
    color: "#2dd4d4",
    cursor: "pointer",
  },
};

export default ReservationForm;
