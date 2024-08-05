import { ApolloServer } from '@apollo/server';
import { DateTimeTypeDefinition,
        DateTimeResolver,
        ObjectIDTypeDefinition,
        ObjectIDResolver } from 'graphql-scalars';
import fs from 'fs';
import path from 'path';

const  toolTypeDefs = fs.readFileSync(path.join(path.resolve(), './tools/community-data-access/schema.graphql'), 'utf-8')

const typeDefs = [
    DateTimeTypeDefinition, 
    ObjectIDTypeDefinition,
    toolTypeDefs
    ];
const sampleData = {
    "data": [
        {
            "name": "Reserve at Ballenger Creek",
            "domain": "ballenger.com",
            "whiteLabelDomain": "ballenger.com",
            "handle": "ballenger",
            "publicContentBlobUrl": "https://ballenger.com",
            "id": "66b0319fac4d303ccb1212c3",
            "createdAt": "2022-01-01",
            "updatedAt": "2022-01-01",
            "userIsAdmin": false
        },
        {
            "name": "Atlantis",
            "domain": "atlantis.com",
            "whiteLabelDomain": "atlantis.com",
            "handle": "atlantis",
            "publicContentBlobUrl": "https://atlantis.com",
            "id": "66b031b5016f5e13b7bae6e5",
            "createdAt": "2022-01-01",
            "updatedAt": "2022-01-01",
            "userIsAdmin": true
        },
        {
            "name": "Reserve at ChesterField",
            "domain": "chesterfield.com",
            "whiteLabelDomain": "chesterfield.com",
            "handle": "chesterfield",
            "publicContentBlobUrl": "https://chesterfield.com",
            "id": "66b031bff6af49b26d1e6285",
            "createdAt": "2022-01-01",
            "updatedAt": "2022-01-01",
            "userIsAdmin": false
        }
    ]
};
const resolvers = {

    Query: {
        community: () => sampleData.data[0],
        communityById: (_parent: any, args: { id: string; }) => sampleData.data.find((community) => community.id === args.id),
        communities: () => sampleData.data
    }
};
const server:ApolloServer = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: {
        DateTime:DateTimeResolver, 
        ObjectID:ObjectIDResolver,
        ...resolvers 
    }
});


export default {
    apolloInstance: server,
    typeDefs: typeDefs,
};