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
    mutation MyMutation($frogID: uuid) {
      delete_FrogsDB_frogs(where: { id: { _eq: $frogID } }) {
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
        id
        name
        count
      }
    }
  `;

  static SUBSCRIPTION_AllFrogs = gql`
    subscription MySubscription {
      FrogsDB_frogs {
        id
        name
        count
      }
    }
  `;
}
