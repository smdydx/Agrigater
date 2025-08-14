interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    icon: string;
    gradient: string;
    iconColor: string;
  };
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "spa":
        return "💆"; // Spa emoji
      case "scissors":
        return "✂️"; // Scissors emoji
      case "hands":
        return "👐"; // Hands emoji
      case "dumbbell":
        return "🏋️"; // Dumbbell emoji
      default:
        return "📍"; // Default pin emoji
    }
  };

  return (
    <div 
      className="flex-shrink-0 text-center cursor-pointer hover:opacity-80 transition-opacity"
      data-testid={`category-${category.id}`}
    >
      <div className={`w-16 h-16 bg-gradient-to-br ${category.gradient} rounded-2xl flex items-center justify-center mb-2`}>
        <span className="text-2xl">{getIconComponent(category.icon)}</span>
      </div>
      <span className="text-xs text-gray-600">{category.name}</span>
    </div>
  );
}
