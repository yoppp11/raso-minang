export default function SpicyBadge({ isSpicy }: { isSpicy: boolean }){
    if(!isSpicy) return null
    
    return (
        <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            Pedas
        </span>
    )
}