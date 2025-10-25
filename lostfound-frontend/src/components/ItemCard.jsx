import React from "react";

function ItemCard({ item, onClaim }) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "15px",
        textAlign: "center",
        boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt={item.title}
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            borderRadius: "10px",
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "200px",
            backgroundColor: "#f0f0f0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "10px",
            color: "#999",
            fontStyle: "italic",
          }}
        >
          No Image
        </div>
      )}

      <h3 style={{ marginTop: "10px" }}>{item.title}</h3>
      <p><strong>Description:</strong> {item.description}</p>
      <p><strong>Location:</strong> {item.location}</p>
      <p><strong>Type:</strong> {item.type}</p>
      <p><strong>Date:</strong> {new Date(item.dateOccurred).toLocaleString()}</p>
      <p><strong>Contact:</strong> {item.contactInfo}</p>
      <p><strong>Status:</strong> {item.status}</p>

      {/* Claim button for FOUND items only if OPEN */}
      {item.type === "FOUND" && item.status === "OPEN" && onClaim && (
        <button
          onClick={() => onClaim(item)}
          style={{
            marginTop: "10px",
            padding: "8px 12px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Claim
        </button>
      )}

      {/* Contact Owner button for LOST items only if OPEN */}
      {item.type === "LOST" && item.status === "OPEN" && onClaim && (
        <button
          onClick={() => onClaim(item)}
          style={{
            marginTop: "10px",
            padding: "8px 12px",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Contact Owner
        </button>
      )}
    </div>
  );
}

export default ItemCard;
