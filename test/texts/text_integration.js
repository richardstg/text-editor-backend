process.env.NODE_ENV = "test";

const chai = require("chai");
const chaiHttp = require("chai-http");
const { app: server } = require("../../app.js");

chai.should();

chai.use(chaiHttp);

describe("Texts", () => {
  describe("GET /", () => {
    it("200 HAPPY PATH", (done) => {
      chai
        .request(server)
        .get("/")
        .end((err, res) => {
          if (err) done(err);

          res.should.have.status(200);
          res.body.should.be.an("array");
          res.body.length.should.be.above(0);

          done();
        });
    });
  });

  describe("GET /:id", () => {
    it("200 HAPPY PATH", (done) => {
      chai
        .request(server)
        .get("/613a616168333e3b2cc22478")
        .end((err, res) => {
          if (err) done(err);

          res.should.have.status(200);
          res.body.should.be.an("object");

          done();
        });
    });
  });

  describe("POST /", () => {
    it("201 HAPPY PATH", (done) => {
      chai
        .request(server)
        .post("/")
        .set("content-type", "application/json")
        .send({ name: "Mr. Tester", content: "Adding a test text..." })
        .end((err, res) => {
          if (err) done(err);

          res.should.have.status(201);
          res.body.should.be.an("object");

          done();
        });
    });
  });

  describe("PUT /:id", () => {
    it("201 HAPPY PATH", (done) => {
      chai
        .request(server)
        .put("/613a616168333e3b2cc22478")
        .set("content-type", "application/json")
        .send({ name: "Mr. Tester", content: "This is a test text." })
        .end((err, res) => {
          if (err) done(err);

          res.should.have.status(200);
          res.body.should.be.an("object");

          done();
        });
    });
  });
});
