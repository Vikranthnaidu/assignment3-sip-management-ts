const request = require("supertest")
const app = require("../server")

describe("Get Investor API",()=>{
    test("Valid API Call",async ()=>{
        const result = await request(app).get('/api/investor/INV001');
        expect(result.statusCode).toBe(200)
        expect(result.body.investor_id).not.toBeNull();
    })

    test("Invalid API call",async ()=>{
        const result = await request(app).get('/api/investor/INV111');
        console.log(`Body of the response ${JSON.stringify(result.body)}`)
        expect(result.statusCode).toBe(404)
    })
})
