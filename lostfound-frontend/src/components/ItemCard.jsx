import React from "react";

function ItemCard({ item, onClaim }) {
  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col"
    >
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-100 flex justify-center items-center text-gray-400 italic">
          No Image
        </div>
      )}

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>

        <p className="text-sm text-gray-600">
          <span className="font-medium">Description:</span> {item.description}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Location:</span> {item.location}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Type:</span> {item.type}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Date:</span>{" "}
          {new Date(item.dateOccurred).toLocaleString()}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Contact:</span> {item.contactInfo}
        </p>
        <p
          className={`text-sm font-medium mt-1 ${
            item.status === "RESOLVED" ? "text-green-600" : "text-yellow-600"
          }`}
        >
          Status: {item.status}
        </p>

        {/* Action Button */}
        {item.status === "OPEN" && onClaim && (
          <button
            onClick={() => onClaim(item)}
            className={`mt-auto w-full py-2 rounded-lg text-white font-medium transition-colors duration-200 ${
              item.type === "FOUND"
                ? "bg-green-500 hover:bg-green-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {item.type === "FOUND" ? "Claim" : "Contact Owner"}
          </button>
        )}
      </div>
    </div>
  );
}

export default ItemCard;
