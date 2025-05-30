import { StatCardProps } from "../../types";

const StatCard: React.FC<StatCardProps> = ({ 
    number, 
    label, 
    description,
    numberColor = "text-green-600",
    labelColor = "text-gray-800",
    descriptionColor = "text-gray-600"
  }) => {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
        <div className={`text-4xl md:text-5xl font-bold ${numberColor} mb-2`}>
          {number}
        </div>
        <div className={`text-lg font-semibold ${labelColor} mb-2`}>
          {label}
        </div>
        <p className={`text-sm ${descriptionColor}`}>
          {description}
        </p>
      </div>
    );
  };
  
  export default StatCard;