import { SectionTitleProps } from "../../types";

const SectionTitle: React.FC<SectionTitleProps> = ({ 
    title, 
    subtitle, 
    centered = false,
    titleColor = "text-gray-800",
    subtitleColor = "text-gray-600"
  }) => {
    return (
      <div className={`mb-8 ${centered ? 'text-center' : ''}`}>
        <h2 className={`text-3xl md:text-4xl font-bold ${titleColor} mb-4`}>
          {title}
        </h2>
        {subtitle && (
          <p className={`text-lg ${subtitleColor} max-w-3xl ${centered ? 'mx-auto' : ''}`}>
            {subtitle}
          </p>
        )}
      </div>
    );
  };
  
export default SectionTitle;