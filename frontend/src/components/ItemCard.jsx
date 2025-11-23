import React, { useState } from 'react';
import { MapPin, Calendar, User, Tag, Trash2, CheckCircle, Mail, ImageOff } from 'lucide-react';

const ItemCard = ({ item, onDelete, onResolve, onClaim }) => {
  // State to track if the image failed to load
  const [imageError, setImageError] = useState(false);

  if (!item) return null;

  const currentUserId = localStorage.getItem("userId");
  const currentUserRole = localStorage.getItem("userRole");
  const creatorId = item.createdBy?.id;
  const isOwner = creatorId && String(creatorId) === String(currentUserId);
  const isAdmin = currentUserRole === 'ADMIN';
  const canModify = isOwner || isAdmin;

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown Date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden">
      
      {/* Image Section */}
      <div className="relative h-52 w-full bg-gray-100 overflow-hidden flex items-center justify-center">
        {!imageError && item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)} // Set error state instead of replacing src
          />
        ) : (
          /* Fallback UI when image is missing or broken */
          <div className="flex flex-col items-center justify-center text-gray-400">
            <ImageOff size={40} className="mb-2 opacity-50" />
            <span className="text-xs font-medium uppercase tracking-wider">No Image</span>
          </div>
        )}

        {/* Type Badge */}
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold tracking-wide text-white shadow-md ${
          item.type === 'LOST' ? 'bg-rose-500' : 'bg-emerald-500'
        }`}>
          {item.type}
        </div>
        
        {/* Status Badge */}
        {item.status !== 'OPEN' && (
           <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold bg-gray-900/80 backdrop-blur-sm text-white border border-gray-700">
             {item.status}
           </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
           <h3 className="text-xl font-bold text-gray-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
             {item.title || "Untitled"}
           </h3>
        </div>
        
        <div className="inline-flex items-center text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md w-fit mb-3">
            <Tag size={12} className="mr-1.5" />
            {item.category || "General"}
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
          {item.description}
        </p>

        <div className="grid grid-cols-2 gap-y-2 text-xs text-gray-500 border-t border-gray-100 pt-4 mb-4">
          <div className="flex items-center"><MapPin size={14} className="mr-1.5 text-gray-400" />{item.location}</div>
          <div className="flex items-center justify-end"><Calendar size={14} className="mr-1.5 text-gray-400" />{formatDate(item.dateOccurred)}</div>
          <div className="col-span-2 flex items-center mt-1"><User size={14} className="mr-1.5 text-gray-400" />Posted by: {item.createdBy?.name || 'Unknown'}</div>
        </div>

        {/* Actions */}
        <div className="mt-auto pt-2 flex gap-2">
          {canModify ? (
            <>
              {item.status === 'OPEN' && (
                <button onClick={() => onResolve && onResolve(item.id)} className="flex-1 flex items-center justify-center bg-emerald-50 text-emerald-600 hover:bg-emerald-100 py-2 rounded-lg text-sm font-semibold transition-colors">
                  <CheckCircle size={16} className="mr-1.5" /> Resolve
                </button>
              )}
              <button onClick={() => onDelete && onDelete(item.id)} className="flex-1 flex items-center justify-center bg-rose-50 text-rose-600 hover:bg-rose-100 py-2 rounded-lg text-sm font-semibold transition-colors">
                <Trash2 size={16} className="mr-1.5" /> Delete
              </button>
            </>
          ) : (
            item.status === 'OPEN' && (
              <button onClick={() => onClaim && onClaim(item)} className="w-full flex items-center justify-center bg-indigo-600 text-white hover:bg-indigo-700 py-2.5 rounded-lg text-sm font-semibold shadow-sm hover:shadow-md transition-all">
                <Mail size={16} className="mr-2" /> Contact Owner
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemCard;