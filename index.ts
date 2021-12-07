import Express from "express";
import { dealershipDaoAzure } from "./daos/dealership-dao";
import { Car, Dealership } from "./entities";
import errorHandler from "./error-handles";
import { DealershipService, DealershipServiceImpl } from "./services/dealership-service";

const app = Express()
app.use(Express.json())


const dealershipService: DealershipService = new DealershipServiceImpl(dealershipDaoAzure)

app.get('/dealerships', async (req, res) => {

    try {
        const dealerships: Dealership[] = await dealershipService.retriveAllDealerships();
        res.send(dealerships)
    } catch (error) {
        errorHandler(error,req,res)
    }
    
})

app.get('/dealerships/:id', async (req, res)=>{

    try {
        const dealership: Dealership = await dealershipService.retrieveDealershipById(req.params.id)
        res.send(dealership)
    } catch (error) {
        errorHandler(error,req,res)
    }

})

app.post('/dealerships', async (req, res)=>{

    try {
        let dealership: Dealership = req.body
        dealership = await dealershipService.addDealership(dealership)
        res.sendStatus(201)
        res.send(dealership)      
    } catch (error) {
        errorHandler(error,req,res)
    }


})

app.post('/dealerships/:id/cars', async (req,res)=>{

    try {
        const car: Car = req.body
        await dealershipService.addCarToDealership(req.params.id, car)
        res.sendStatus(201)   
    } catch (error) {
        errorHandler(error,req,res)
    }
})

app.listen(3000, () => console.log('App started'))