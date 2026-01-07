function ReservationConfirm() {
  return (
    <div style={styles.container}>
      <h1 style={styles.pageTitle}>Confirm Your Reservation</h1>
      <p style={styles.subtitle}>
        Please review all details before confirming your booking
      </p>

      <div style={styles.grid}>
        {/* Booking Details */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Booking Details</h2>

          <h4 style={styles.subTitle}>Slot Information</h4>
          <p><strong>Slot Number:</strong> A12</p>
          <p><strong>Type:</strong> Covered</p>
          <p><strong>Location:</strong> City Center</p>
          <p><strong>Floor:</strong> B1</p>

          <h4 style={styles.subTitle}>Date & Time</h4>
          <p><strong>Check-in:</strong> 12 Oct 2026 – 10:00 AM</p>
          <p><strong>Check-out:</strong> 12 Oct 2026 – 2:00 PM</p>
          <p><strong>Duration:</strong> 4 Hours</p>

          <h4 style={styles.subTitle}>Vehicle Details</h4>
          <p><strong>Number:</strong> WP CAB 1234</p>
          <p><strong>Type:</strong> Car</p>
          <p><strong>Brand:</strong> Toyota</p>
        </div>

        {/* Pricing Breakdown */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Pricing Breakdown</h2>

          <p><span style={styles.label}>Base Fee:</span> LKR 200</p>
          <p><span style={styles.label}>Duration Charges:</span> LKR 600</p>
          <p><span style={styles.label}>Subtotal:</span> LKR 800</p>
          <p><span style={styles.label}>Service Fee:</span> LKR 50</p>

          <hr style={styles.divider} />

          <p style={styles.total}>Total: LKR 850</p>
        </div>
      </div>

      {/* Important Notes */}
      <div style={styles.notesCard}>
        <h2 style={styles.cardTitle}>Important Notes</h2>
        <p>❌ Free cancellation up to 1 hour before check-in</p>
        <p>⏰ 15-minute grace period for late arrival</p>
        <p>⚠️ Overstay charges apply beyond reserved time</p>
        <p>🚫 No-show will result in full charge</p>
      </div>

      {/* Terms */}
      <div style={styles.terms}>
        <input type="checkbox" />
        <label>&nbsp;I agree to the Terms & Conditions</label>
      </div>

      {/* Feedback UI */}
      <p style={styles.processing}>Processing your reservation...</p>
      <p style={styles.error}>⚠️ Payment failed. Please try again.</p>

      {/* Actions */}
      <div style={styles.actions}>
        <button style={styles.secondaryBtn}>Edit Booking</button>
        <button style={styles.secondaryBtn}>Cancel</button>
        <button style={styles.primaryBtn}>
          Confirm Reservation
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "50px 20px",
    backgroundColor: "#f9fafb",
    minHeight: "100vh",
  },
  pageTitle: {
    textAlign: "center",
    fontSize: "32px",
    fontWeight: "700",
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: "40px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "25px",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  card: {
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
  },
  notesCard: {
    maxWidth: "1000px",
    margin: "30px auto",
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: "600",
    borderBottom: "2px solid #2dd4d4",
    paddingBottom: "8px",
    marginBottom: "15px",
  },
  subTitle: {
    marginTop: "15px",
    fontWeight: "600",
    color: "#444",
  },
  label: {
    fontWeight: "600",
  },
  divider: {
    margin: "15px 0",
    borderTop: "1px solid #eee",
  },
  total: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#2dd4d4",
    textAlign: "right",
  },
  terms: {
    textAlign: "center",
    margin: "20px 0",
  },
  processing: {
    textAlign: "center",
    color: "#555",
    fontStyle: "italic",
  },
  error: {
    textAlign: "center",
    color: "red",
    fontSize: "14px",
  },
  actions: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginTop: "25px",
  },
  primaryBtn: {
    backgroundColor: "#2dd4d4",
    color: "#fff",
    border: "none",
    padding: "14px 30px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },
  secondaryBtn: {
    backgroundColor: "transparent",
    color: "#2dd4d4",
    border: "2px solid #2dd4d4",
    padding: "12px 20px",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default ReservationConfirm;
