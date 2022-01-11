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

  static DeleteRecords = gql`
    mutation MyMutation($name: String) {
      delete_FrogsDB_frogs(where: { name: { _eq: $name } }) {
        returning {
          name
          count
        }
      }
    }
  `;

  static InsertRecord = gql`
    mutation MyMutation($name: String, $count: Int = "0") {
      insert_FrogsDB_frogs_one(object: { name: $name, count: $count }) {
        name
        count
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
