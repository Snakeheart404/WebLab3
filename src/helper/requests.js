import { gql } from "@apollo/client";

export class Queries {
  static DeleteRecords = gql`
    mutation MyMutation {
      delete_frogs(where: { count: { _lte: 0 } }) {
        returning {
          name
          count
        }
      }
    }
  `;

  static InsertRecord = gql`
  mutation MyMutation($name: String, $count: Int = "0") {
    insert_frogs_one(object: {name: "${name}", count: ${count}}) {
      {
        name
        count
      }
    }
  }
    `;

  static SUBSCRIPTION_AllFrogs = gql`
    subscription MySubscription {
      frogs {
        name
        count
      }
    }
  `;
}
