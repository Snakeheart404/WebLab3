import { loadersCount } from "./stores.js";
import { update } from "svelte/store";

class RequestHelper {
  API_URL = api_url_env;
  async fetchGraphQL(operationsDoc, operationName, variables) {
    return fetch(this.API_URL, {
      method: "POST",
      body: JSON.stringify({
        query: operationsDoc,
        variables: variables,
        operationName: operationName,
      }),
    }).then(result => {
      return result.json();
    });
  }

  fetchMyQuery(operationsDoc) {
    return this.fetchGraphQL(operationsDoc, "MyQuery", {});
  }

  async startFetchMyQuery(operationsDoc) {
    const { errors, data } = await this.fetchMyQuery(operationsDoc);
    if (errors) {
      throw new Error(errors.message.join("\n"));
    }
    return data;
  }

  executeMyMutation(operationsDoc) {
    return this.fetchGraphQL(operationsDoc, "MyMutation", {});
  }

  async startExecuteMyMutation(operationsDoc) {
    loadersCount.update(n => n + 1);
    const { errors, data } = await this.executeMyMutation(operationsDoc);
    if (errors) {
      throw new Error(errors.message.join("\n"));
    }
    loadersCount.update(n => n - 1);
    return data;
  }
}
export default new RequestHelper();
