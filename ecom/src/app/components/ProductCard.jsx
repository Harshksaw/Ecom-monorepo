import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProductCard = ({ data: { attributes: p, id } }) => {
console.log("🚀 ~ ProductCard ~ data:", data)




  

    return (
        <Link
            href={`/product/${p.slug}`}
            className="transform overflow-hidden bg-white duration-200 hover:scale-105 cursor-pointer"
        >
            <Image
                loading="lazy"
                width={500}
                height={500}
                src={data.images[0]}
                alt={p.name}
            />
            <div className="p-4 text-black/[0.9]">
                <h2 className="text-lg font-medium">{p.name}</h2>
                <div className="flex items-center text-black/[0.5]">
                    <p className="mr-2 text-lg font-semibold">
                        &#8377;{p.price}
                    </p>

                  
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;