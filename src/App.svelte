<script>
  import http from "./helper/request-helper";
  import { Queries } from "./helper/requests";
  import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
  import { setClient, subscribe } from "svelte-apollo";
  import { WebSocketLink } from "@apollo/client/link/ws";

  function createApolloClient() {
    const wsLink = new WebSocketLink({
      uri: "wss://lab3withfrogs.herokuapp.com/v1/graphql",
      options: {
        reconnect: true,
      },
    });
    const cache = new InMemoryCache();
    return new ApolloClient({
      link: wsLink,
      cache,
    });
  }

  const client = createApolloClient();
  setClient(client);

  const frogsArray = subscribe(Queries.SUBSCRIPTION_AllFrogs);

  const AddFrog = async () => {
    let newFrogsArr = [];
    newFrogsArr = document.getElementById("newFrogInputbox").value.split(";");
    if (newFrogsArr[1] < 0) return;
    await http.startExecuteMyMutation(
      Queries.InsertRecord(newFrogsArr[0], newFrogsArr[1])
    );
  };

  const DeleteFrogByName = async () => {
    let deleteFrog = document.getElementById("newFrogInputbox").value;
    await http.startExecuteMyMutation(Queries.DeleteByName(deleteFrog));
  };
</script>

<main>
  {#if $frogsArray.loading}
    <div>loading ...</div>
  {:else if $frogsArray.error}
    <div>Error!</div>
  {:else if $frogsArray.data}
    <caption>Name of the frog and count must be separated by ;</caption>
    <input id="newFrogInputbox" />
    <button on:click={AddFrog}>Add frog</button>
    <button on:click={DeleteFrogByName}>Delete frogs by name</button>
    <table border="1">
      <caption>Frogs</caption>
      <tr>
        <th>Name</th>
        <th>Count</th>
      </tr>
      {#each $frogsArray.data.FrogsDB_frogs as frog}
        <tr>
          <td>{frog.name}</td>
          <td>{frog.count}</td>
        </tr>
      {/each}
    </table>
  {/if}
</main>

<style>
  main {
    padding: 0;
    margin: 0;
  }
</style>
