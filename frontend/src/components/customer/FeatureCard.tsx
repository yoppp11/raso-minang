import { FeatureCardProps } from "../../types";

const FeatureCard: React.FC<FeatureCardProps> = ({ 
    title, 
    description, 
    icon: Icon, 
    iconColor = "bg-green-100 text-green-600",
    hoverEffect = true 
  }) => {
    return (
      <div className={`bg-white p-6 rounded-lg shadow-lg text-center ${
        hoverEffect ? 'hover:shadow-xl transition-shadow duration-300' : ''
      }`}>
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${iconColor}`}>
          <Icon className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-3">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
    );
  };
  
  export default FeatureCard;