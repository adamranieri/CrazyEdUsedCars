import { Dealership } from "../entities";
import { CosmosClient } from "@azure/cosmos";
import { v4 } from "uuid";
import { ResourceNotFoundError } from "../error-handles";

export interface DealershipDAO{

    //Create
    createDealership(dealership: Dealership): Promise<Dealership>

    //Read
    getDealershipById(id: string): Promise<Dealership>
    getAllDealerships(): Promise<Dealership[]>

    //Update
    updateDealership(dealership: Dealership): Promise<Dealership>

    //Delete
    deleteDealershipById(id: string ): Promise<boolean>

}


class DealershipDaoAzure implements DealershipDAO{

    private client = new CosmosClient(process.env.DB ?? 'AccountEndpoint=https://crazy-ed.documents.azure.com:443/;AccountKey=thisisafakekey==;')
    private database = this.client.database('CrazyEdDB')
    private container = this.database.container('Dealerships')

    async createDealership(dealership: Dealership): Promise<Dealership> {
        dealership.id = v4();
        const response = await this.container.items.create<Dealership>(dealership)
        const {id, name, cars} = response.resource;
        return {id, name, cars}
    }

    async getDealershipById(dId: string): Promise<Dealership> {
        const response = await this.container.item(dId, dId).read<Dealership>();// resource-key, partition-key (the same for most containers)
        if(!response.resource){
            throw new ResourceNotFoundError(`The resource with id ${dId} was not found`)
        }
        return {id:response.resource.id, name: response.resource.name, cars:response.resource.cars}
    }

    async getAllDealerships(): Promise<Dealership[]> {
        const response = await this.container.items.readAll<Dealership>().fetchAll()
        return response.resources.map(i => ({cars: i.cars, id:i.id, name:i.name}))
    }
    
    async updateDealership(dealership: Dealership): Promise<Dealership> {
       const response = await this.container.items.upsert<Dealership>(dealership)
       if(!response.resource){
            throw new ResourceNotFoundError(`The resource with id ${dealership.id} was not found`)
       }
       const {id, name, cars} = response.resource
       return {id, name, cars}
    }

    async deleteDealershipById(id: string): Promise<boolean> {
       const response = await this.container.item(id,id).delete();
       if(!response.resource){
            throw new ResourceNotFoundError(`The resource with id ${id} was not found`)
        }
       return true
    }
    
}

export const dealershipDaoAzure = new DealershipDaoAzure(); // export an implementation of a Dealership DAO