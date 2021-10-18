// process.env.NODE_ENV = "test";

// const chai = require("chai");
// const chaiHttp = require("chai-http");
// const { app: server } = require("../../app.js");
// const Comment = require("../../models/comment");

// chai.should();
// chai.use(chaiHttp);

// // let defaultUser = {
// //   name: "test@test.com",
// //   password: "richard",
// // };

// let token;
// let commentDeleteId;

// describe("Comments", () => {
//   beforeEach((done) => {
//     chai
//       .request(server)
//       .post("/auth/login")
//       .send({
//         email: "test_3@test.com",
//         password: "richard",
//       })
//       .end((err, res) => {
//         if (err) done(err);
//         token = res.body.token;
//         res.should.have.status(200);
//         done();
//       });
//   });

//   describe("DELETE /", () => {
//     beforeEach((done) => {
//       chai
//         .request(server)
//         .post("/comment")
//         .set("content-type", "application/json")
//         .set({ Authorization: `Bearer ${token}` })
//         .send({
//           row: "1",
//           content: "Adding a test comment...",
//           textId: "616bd76303c82b5228c48387",
//         })
//         .end((err, res) => {
//           if (err) done(err);
//           res.should.have.status(200);
//           res.body.should.be.an("object");
//           commentDeleteId = res.body.id;
//           done();
//         });
//     });
//     it("200 DELETE COMMENT", (done) => {
//       chai
//         .request(server)
//         .delete("/comment")
//         .set("content-type", "application/json")
//         .set({ Authorization: `Bearer ${token}` })
//         .send({
//           id: commentDeleteId,
//         })
//         .end((err, res) => {
//           if (err) done(err);
//           res.should.have.status(200);
//           done();
//         });
//     });
//     it("500 DELETE COMMENT DOES NOT EXIST", (done) => {
//       chai
//         .request(server)
//         .delete("/comment")
//         .set("content-type", "application/json")
//         .set({ Authorization: `Bearer ${token}` })
//         .send({
//           id: "616adac93056058e511",
//         })
//         .end((err, res) => {
//           if (err) done(err);
//           res.should.have.status(500);
//           done();
//         });
//     });
//     it("401 DELETE COMMENT UNAUTHORIZED USER", (done) => {
//       chai
//         .request(server)
//         .delete("/comment")
//         .set("content-type", "application/json")
//         .set({ Authorization: `Bearer ${token}` })
//         .send({
//           id: "616b368c543851487ce503c1",
//         })
//         .end((err, res) => {
//           if (err) done(err);
//           res.should.have.status(401);
//           done();
//         });
//     });
//   });
// });
