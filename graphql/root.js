const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
} = require("graphql");

const TextType = require("./text.js");
const UserType = require("./user.js");
const HttpError = require("../models/http-error");
const Text = require("../models/text.js");
const User = require("../models/user.js");
const mongoose = require("mongoose");

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    texts: {
      type: GraphQLList(TextType),
      description: "List of all texts",
      resolve: async () => {
        let texts;

        try {
          texts = await Text.find().sort({
            created: -1,
          });
        } catch (err) {
          const error = new HttpError(
            "Fetching texts failed, please try again later.",
            500
          );
          throw error;
          // return next(error);
        }

        if (texts.length < 1) {
          const error = new HttpError("There are no texts yet.", 500);
          // return next(error);
          throw error;
        }

        return texts.map((text) => text.toObject({ getters: true }));
      },
    },
    text: {
      type: TextType,
      description: "A single text",
      args: {
        id: { type: GraphQLString },
      },
      resolve: async (parent, args) => {
        const id = args.id;

        let text;

        try {
          text = await Text.findById(id);
        } catch (err) {
          const error = new HttpError(
            "Fetching text failed, please try again later.",
            500
          );
          // return next(error);
          throw error;
        }

        if (!text) {
          const error = new HttpError("Could not find text.", 500);
          // return next(error);
          throw error;
        }

        return text.toObject({ getters: true });
      },
    },
    users: {
      type: GraphQLList(UserType),
      description: "List of all users",
      resolve: async () => {
        let users;

        try {
          users = await User.find().sort({
            created: -1,
          });
        } catch (err) {
          const error = new HttpError(
            "Fetching users failed, please try again later.",
            500
          );
          // return next(error);
          throw error;
        }

        if (users.length < 1) {
          const error = new HttpError("There are no users yet.", 500);
          // return next(error);
          throw error;
        }

        return users.map((user) => user.toObject({ getters: true }));
      },
    },
    user: {
      type: UserType,
      description: "A single user",
      args: {
        id: { type: GraphQLString },
      },
      resolve: async (parent, args) => {
        const id = args.id;

        let user;

        try {
          user = await User.findById(id);
        } catch (err) {
          const error = new HttpError(
            "Fetching user failed, please try again later.",
            500
          );
          // return next(error);
          throw error;
        }

        if (!user) {
          const error = new HttpError("Could not find user.", 500);
          // return next(error);
          throw error;
        }

        return user.toObject({ getters: true });
      },
    },
  }),
});

const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  fields: () => ({
    addText: {
      type: TextType,
      description: "Add a text",
      args: {
        userId: { type: GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLNonNull(GraphQLString) },
        content: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async function (parent, args) {
        const { name, content, userId: creator } = args;
        const created = new Date();
        const createdText = new Text({
          name,
          content,
          created,
          creator,
        });

        // Get the user that created the text
        let user;

        try {
          user = await User.findById(creator);
        } catch (err) {
          const error = new HttpError(
            "Creating text post failed, please try again.",
            500
          );
          // return next(error);
          throw error;
        }

        if (!user) {
          const error = new HttpError(
            "Could not find user for provided id.",
            404
          );
          // return next(error);
          throw error;
        }

        try {
          const sess = await mongoose.startSession();

          sess.startTransaction();

          await createdText.save({ session: sess });
          user.texts.push(createdText.id);
          await user.save({ session: sess });

          await sess.commitTransaction();
        } catch (err) {
          const error = new HttpError(
            "Creating text failed, please try again.",
            500
          );
          // return next(error);
          throw error;
        }

        return {
          id: createdText.id,
          name: createdText.name,
          content: createdText.content,
          creator: createdText.creator,
        };
      },
    },
    updateText: {
      type: TextType,
      description: "Update a text",
      args: {
        id: { type: GraphQLNonNull(GraphQLString) },
        userId: { type: GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLNonNull(GraphQLString) },
        content: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async function (parent, args) {
        const { id, name, content, userId: creator } = args;

        let text;

        try {
          text = await Text.findById(id);
        } catch (err) {
          const error = new HttpError(
            "Fetching text failed, please try again later.",
            500
          );
          // return next(error);
          throw error;
        }

        if (!text) {
          const error = new HttpError("Could not find text.", 500);
          // return next(error);
          throw error;
        }

        // try {
        //   const token = args.token;
        //   if (!token) {
        //     throw new Error("Authentication failed!");
        //   }
        //   const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        //   if (decodedToken.userId !== text.creator.toString()) {
        //     throw new Error("You are not allowed to update this text!");
        //   }
        // } catch (err) {
        //   const error = new HttpError("Authentication failed!", 403);
        //   // return next(error);
        //   return;
        // }

        if (text.creator.toString() !== creator.toString()) {
          const error = new HttpError(
            "You are not allowed to update this text.",
            500
          );
          // return next(error);
          throw error;
        }

        text.name = name;
        text.content = content;

        try {
          await text.save();
        } catch (err) {
          const error = new HttpError(
            "Updating text failed, please try again later.",
            500
          );
          // return next(error);
          throw error;
        }

        return text.toObject({ getters: true });
      },
    },
  }),
});

module.exports = { RootQueryType, RootMutationType };
