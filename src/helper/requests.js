import { gql } from "@apollo/client";

export class Queries {
  static AllRecords = () => `
  query MyQuery {
    FrogsDB_frogs {
      count
      name
    }
  }
  `;

  static InsertRecord = (name, count) => `
  mutation MyMutation {
    insert_FrogsDB_frogs(objects: {name: "${name}", count: ${count}}) {
      returning {
        name
        count
      }
    }
  }
    `;

  static DeleteByName = (name) => `
  mutation MyMutation {
    delete_FrogsDB_frogs(where: {name: {_eq: "${name}"}}) {
      returning {
        name
        count
      }
    }
  }
  
  `;

  static SUBSCRIPTION_AllFrogs = gql`
    subscription MySubscription {
  FrogsDB_frogs {
    name
    count
  }
}
  `;
}
