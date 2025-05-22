import { LucideIcon, TrendingUp } from "lucide-react"
import Card from "./Card"

export default function StatsCard({ title, value, change, icon: Icon, color = "green" } : {
    title: string,
    value: string,
    change?: string,
    icon: LucideIcon,
    color?: "green" | "blue" | "yellow" | "red",
}) {
    const colorClasses = {
      green: "bg-green-100 text-green-600",
      blue: "bg-blue-100 text-blue-600",
      yellow: "bg-yellow-100 text-yellow-600",
      red: "bg-red-100 text-red-600"
    }
    
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {change && (
              <p className="text-sm text-green-600 mt-1">
                <TrendingUp className="inline h-4 w-4 mr-1" />
                {change}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </Card>
    )
  }