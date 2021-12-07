import { DealershipDAO } from "../daos/dealership-dao";
import { Car, Dealership } from "../entities";

// The service is used for business logic (rules applicable to to the real world) no negative ages, default values, etc...
// Also useful for logging and other utilities
export interface DealershipService{

    addCarToDealership(dealershipId: string, car: Car ):Promise<Dealership>

    retrieveDealershipById(dealershipId: string): Promise<Dealership>

    retriveAllDealerships(): Promise<Dealership[]>;

    addDealership(dealership: Dealership): Promise<Dealership>

}


export class DealershipServiceImpl implements DealershipService{

    // Dependency Injection allows us to swap the implementation of a dependency/property
    constructor(private dealershipDAO: DealershipDAO){}

    async addDealership(dealership: Dealership): Promise<Dealership> {
        dealership.cars = dealership.cars ?? []
        dealership = await this.dealershipDAO.createDealership(dealership)
        return dealership;
    }


    async retriveAllDealerships(): Promise<Dealership[]> {
        return this.dealershipDAO.getAllDealerships() 
    }

    async retrieveDealershipById(dealershipId: string): Promise<Dealership> {
        return this.dealershipDAO.getDealershipById(dealershipId)
    }
    
    async addCarToDealership(dealershipId: string, car: Car): Promise<Dealership> {
        const dealership:Dealership = await this.dealershipDAO.getDealershipById(dealershipId)
        dealership.cars.push(car)
        await this.dealershipDAO.updateDealership(dealership)
        return dealership
    }

}