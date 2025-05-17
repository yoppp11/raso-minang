export default function PriceFormatter({ price }: { price: number }){
    return (
        <span className="font-semibold">
            Rp {price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
        </span>
    )
}