import React from "react";
import { Clock, Calendar, CheckCircle2 } from "lucide-react";

const PlanItemCard = ({
  image,
  title,
  price,
  description,
  time,
  date,
  hasPayment,
  onEdit,
  activityId,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 flex shadow-sm">
      {/* Gambar */}
      <div className="w-32 h-32 shrink-0 rounded-lg overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400';
          }}
        />
      </div>

      {/* Konten */}
      <div className="ml-4 grow relative">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            {price && (
              <span className="text-xs text-gray-500 font-medium">
                Rp.{price}
              </span>
            )}
          </div>
          <CheckCircle2 className="text-green-500 h-5 w-5" />
        </div>

        <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
          {description}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex gap-2">
            <button 
              onClick={() => onEdit && onEdit(activityId)}
              className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
            >
              Edit
            </button>
            {hasPayment && (
              <button className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600">
                Payment
              </button>
            )}
          </div>

          <div className="flex gap-3 text-gray-500">
            <div className="flex items-center gap-1 text-[10px]">
              <Clock className="h-3 w-3" /> {time}
            </div>
            <div className="flex items-center gap-1 text-[10px]">
              <Calendar className="h-3 w-3" /> {date}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanItemCard;
