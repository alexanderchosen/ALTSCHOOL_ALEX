const supertest = require("supertest")
const path = require('path')
const blogHttpServer = require("../routes/blogs")

// path1 = path.relative("test\integration_test\blogs.test.js", "routes\blogs.js")
// console.log(path1)

describe("Blog Route", ()=>{

    it("GET /blogs works", async()=>{
        const response = await supertest(blogHttpServer).get("/blogs")
        expect(response.headers["content-type"]).toBe("application/json")
        expect(response.status).toBe(200)
        expect(response.body.length).toBeGreaterThan(0)
    })

    it("GET /blogs?author works", async ()=>{
        const response = await supertest(blogHttpServer).get("/blogs?author=Alexander Chosen")
        expect(response.headers["content-type"]).toBe("application/json")
        expect(response.status).toBe(200)
        expect(response.body.title).toBe("Beginners guide to Open Source")
    })

    it("POST /blogs works", async()=>{
        const blog2Add = {
            "title": "Community Management For Beginners (CM 101)",
            "description": "This blog is aimed at teaching beginners interested in community management the basics steps involved in community building, content creation and some best practices",
            "tags": ["#CommunityManagement", "#SafeCommunity", "#Beginners", "#Technology", "#Community4All"],
            "author": "Tabitha", 
            "timestamp": "",
            "state": "draft",
            "read_count": 500,
            "reading_time": "25 minutes",
            "body": ""
        }
        const response = await supertest (blogHttpServer).post("/blogs").send(blog2Add)
        expect(response.status).toBe(201)
        expect(response.headers["content-type"]).toBe("application/json")
        expect(response.body.title).toBe("Community Management For Beginners (CM 101)")
        expect(resposne.body.author).toBe("Tabitha")
    })

    it("DELETE /blogs?title works", async () => {
        const response = await supertest(blogHttpServer).delete("/blogs?title=Community Management For Beginners (CM 101)")
        expect(response.headers["content-type"]).toBe("application/json")
        expect(response.status).toBe(200)
        expect(response.body.message).toBe("Blog deleted")

        const response2 = await supertest(blogHttpServer).get("/blogs")
        expect(response2.headers["content-type"]).toBe("application/json")
        expect(response2.status).toBe(200)
        

    })
})