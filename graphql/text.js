const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat,
  GraphQLNonNull,
} = require("graphql");

const UserType = require("./user.js");

const TextType = new GraphQLObjectType({
  name: "Text",
  description: "This represents a text",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLNonNull(GraphQLString) },
    content: { type: GraphQLNonNull(GraphQLString) },
    // creator: { type: GraphQLNonNull(GraphQLString) },
    creator: { type: UserType },
    created: { type: GraphQLNonNull(GraphQLString) },
  }),
});

module.exports = TextType;
