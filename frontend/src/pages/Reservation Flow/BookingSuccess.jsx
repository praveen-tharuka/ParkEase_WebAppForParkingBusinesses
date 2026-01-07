function BookingSuccess() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.icon}>✅</div>
        <h1 style={styles.title}>Booking Confirmed!</h1>
        <p style={styles.text}>
          Your parking reservation has been successfully created.
        </p>
        <p style={styles.subText}>
          A confirmation message has been sent to your email/SMS.
        </p>

        <button style={styles.button}>
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "80vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
    maxWidth: "400px",
  },
  icon: {
    fontSize: "50px",
    marginBottom: "10px",
  },
  title: {
    marginBottom: "10px",
  },
  text: {
    color: "#555",
  },
  subText: {
    color: "#777",
    marginBottom: "20px",
  },
  button: {
    backgroundColor: "#2dd4d4",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default BookingSuccess;
