import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem } from "../../types";

export default function CartItemCard({ 
    item,
    onIncrease,
    onDecrease,
    onRemove,
    onInstructionChange
 }: { 
    item: CartItem,
    onIncrease: (id: number) => void,
    onDecrease: (id: number) => void,
    onRemove: (id: number) => void,
    onInstructionChange: (id: number, instruction: string) => void
  }){
    return (
        <div className="flex flex-col md:flex-row border rounded-lg shadow-sm p-4 mb-4">
            <div className="w-full md:w-1/4 mb-4 md:mb-0">
                <div className="h-40 md:h-32 w-full rounded-lg overflow-hidden">
                <img 
                    src={item.Menu_Item.image_url || "/api/placeholder/200/150"} 
                    alt={item.Menu_Item.name} 
                    className="w-full h-full object-cover"
                />
                </div>
            </div>
            
            <div className="w-full md:w-3/4 md:pl-4 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg">{item.Menu_Item.name}</h3>
                        <button 
                        onClick={() => onRemove(item.id)}
                        className="text-red-500 hover:text-red-700"
                        >
                        <Trash2 size={18} />
                        </button>
                    </div>
                
                    <p className="text-gray-600 text-sm mb-2">{item.Menu_Item.description}</p>
                    
                    {item.Menu_Item.is_spicy && (
                        <span className="inline-block bg-red-100 text-red-600 text-xs px-2 py-1 rounded mb-2">
                        Pedas
                        </span>
                    )}
                    
                    <div className="mt-2">
                        <label className="text-sm text-gray-600 block mb-1">Instruksi khusus:</label>
                        <input
                        type="text"
                        value={item.special_instructions || ''}
                        onChange={(e) => onInstructionChange(item.id, e.target.value)}
                        className="w-full border rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                        placeholder="Contoh: Level pedas sedang, tanpa sayur, dll."
                        />
                    </div>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center border rounded-lg overflow-hidden">
                        <button 
                        onClick={() => onDecrease(item.id)}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                        disabled={item.quantity <= 1}
                        >
                        <Minus size={16} className={item.quantity <= 1 ? "text-gray-400" : "text-gray-600"} />
                        </button>
                        <span className="px-4 py-1 border-l border-r text-center min-w-[40px]">
                        {item.quantity}
                        </span>
                        <button 
                        onClick={() => onIncrease(item.id)}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                        >
                        <Plus size={16} className="text-gray-600" />
                        </button>
                    </div>
                    
                    <div className="text-right">
                        <p className="font-bold text-green-700 text-lg">
                        Rp {(item.Menu_Item.price * item.quantity).toLocaleString('id-ID')}
                        </p>
                        <p className="text-gray-500 text-sm">
                        Rp {item.Menu_Item.price.toLocaleString('id-ID')} x {item.quantity}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
  }