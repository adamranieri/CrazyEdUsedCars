import { DealershipDAO, dealershipDaoAzure } from "../daos/dealership-dao"
import { Car, Dealership } from "../entities";


const dealershipDao: DealershipDAO = dealershipDaoAzure;

let testId: string = null;

describe('Dealship DAO Specs', ()=>{


    it('should create a dealership', async ()=>{
        let dealership: Dealership = {name:'lakeside auto', id:'', cars:[]}
        dealership = await dealershipDao.createDealership(dealership)
        expect(dealership.id).not.toBe('')
        testId = dealership.id
    })

    it('should get a dealership', async ()=>{
        const dealership: Dealership = await dealershipDao.getDealershipById(testId)
        expect(dealership.name).toBe('lakeside auto')
    })

    it('should upsert a dealership', async ()=>{
        const car: Car = {make:'Subaru', model:'crosstrek', price:15000, year:2018, condition: "Used"}
        let dealership: Dealership = {name:'lakeside auto v2', id:testId, cars:[car]}
        await dealershipDao.updateDealership(dealership)
        dealership = await  dealershipDao.getDealershipById(testId)
        expect(dealership.cars.length).toBe(1)
        expect(dealership.name).toBe('lakeside auto v2')
    })

    it('should delete a dealership', async ()=>{
        const response = await dealershipDao.deleteDealershipById(testId);  
    })

})