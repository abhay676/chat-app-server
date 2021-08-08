const types = `
  type User {
    username: String!
    email: String!
    activeToken: String
  }
  type Message {
    messageId: String!
    message: String!
    from: String!
    groupId: String!
    createdAt: String!
  }
  type Group {
    groupId: String!
    name: String!
    slug: String!
  }
  type Query {
    getUser: User!
    login(email: String!, password: String!): User!
    getMessages(groupId: String!): [Message]!
    getGroups: [Group]!
  }
  type Mutation {
    register(username: String!, email: String!, password: String!): User!
    sendMessage(groupId: String!, content: String!): Message!
  }
  type Subscription {
    newMessage: Message!
  }
`;

export default types;
