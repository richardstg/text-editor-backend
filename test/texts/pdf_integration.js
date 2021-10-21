process.env.NODE_ENV = "test";

const chai = require("chai");
const chaiHttp = require("chai-http");
const { app: server } = require("../../app.js");

chai.should();
chai.use(chaiHttp);

let token;

describe("Create PDF", () => {
  beforeEach((done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({
        email: "test@test.com",
        password: "richard",
      })
      .end((err, res) => {
        if (err) done(err);
        token = res.body.token;
        res.should.have.status(200);
        done();
      });
  });

  describe("POST /", () => {
    it("200 CREATE PDF", (done) => {
      chai
        .request(server)
        .post("/create-pdf")
        .set("content-type", "application/json")
        .set({ Authorization: `Bearer ${token}` })
        .send({
          name: "Title of the document",
          content: "PFD content",
        })
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          // res.body.should.be.an("object");
          done();
        });
    });
  });
});
