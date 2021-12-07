export interface Car{

    make: string
    model: string
    year: number 
    price: number
    condition: "broken" | "like-new" | "Used"

}

export interface Dealership{

    id: string
    name: string 
    cars: Car[]

}