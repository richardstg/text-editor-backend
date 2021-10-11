const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat,
  GraphQLNonNull,
} = require("graphql");

const Text = require("../models/text.js");
const HttpError = require("../models/http-error");

const UserType = new GraphQLObjectType({
  name: "User",
  description: "This represents a user",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
    texts: {
      type: new GraphQLList(require("./text.js")),
      description: "List of all texts",
      resolve: async (user) => {
        let texts;

        try {
          texts = await Text.find({ creator: user.id }).sort({
            created: -1,
          });
        } catch (err) {
          const error = new HttpError(
            "Fetching texts failed, please try again later.",
            500
          );
          // return next(error);
          throw error;
        }

        if (texts.length < 1) {
          const error = new HttpError("There are no texts yet.", 500);
          // return next(error);
          throw error;
        }

        return texts.map((text) => text.toObject({ getters: true }));
      },
    },
  }),
});

module.exports = UserType;
