<script>
  import http from "./helper/request-helper";
  import { Queries } from "./helper/requests";
  import Loader from "./components/Loader.svelte";
  import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
  import { setClient, subscribe } from "svelte-apollo";
  import { WebSocketLink } from "@apollo/client/link/ws";
  import { errorMessage, loadersCount } from "./stores.js";

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

  let addFrogDisabled, removeFrogDisabled;
  const client = createApolloClient();
  setClient(client);


  const frogsArray = subscribe(Queries.SUBSCRIPTION_AllFrogs);
  const newFrogInfo = {};
  const addFrogQuery = mutation(Queries.InsertRecord);
  const deleteRecordsQuery = mutation(Queries.DeleteRecords);

  const AddFrog = async () => {
    addFrogDisabled = true;
    $loadersCount++;
    let newFrogsArr = [];
    const { name, count } = newFrogInfo;
    if (!name || !count) {
      addFrogDisabled = false;
      $errorMessage = "Surname, name and debt are required!";
      $loadersCount--;
      return;
    }
    try {
      await addFrogQuery({
      variables: {
                name: newFrogInfo.name,
                count: newFrogInfo.count,
      },
    });
    $errorMessage = "";
  } catch (e) {
    $errorMessage = `Error occurred: ${e.message}`;
  } finally {
    addFrogDisabled = false;
    $loadersCount--;
  }
  };

  const DeleteFrogByName = async () => {
    removeFrogDisabled = true;
    $loadersCount++;
    try {
      await deleteRecordsQuery();
      $errorMessage = "";
    } catch (e) {
      $errorMessage = `Error occurred: ${e.message}`;
    } finally {
      $loadersCount--;
      removeFrogDisabled = false;
    }
  };
</script>

<main>
  {#if $frogsArray.loading}
    <Loader />
  {:else if $frogsArray.error}
    <div class="overlay">
      <h1>Error:(</h1>
      <div class="overlay background" />
    </div>
  {:else if $frogsArray.data}
    <input bind:value={newFrogInfo.name} placeholder="Name" />
    <input bind:value={newFrogInfo.count} placeholder="Count" />
    <button on:click={AddFrog} disabled={addFrogDisabled}>Add frog</button>
    <button on:click={DeleteFrogByName} disabled={removeFrogDisabled}>Delete frogs by name</button>
    <table border="1">
      <caption>Frogs</caption>
      <tr>
        <th>Name</th>
        <th>Count</th>
      </tr>
      {#each $frogsArray.data.frogs as frog (frog.id)}
        <tr>
          <td>{frog.name}</td>
          <td>{frog.count}</td>
        </tr>
      {/each}
    </table>
    <div class="errorLabel">{$errorMessage}</div>
    <div class="overlay" class:visible={!$loadersCount}>
      <Loader />
      <div class="overlay background" />
    </div>
  {/if}
</main>

<style>
  :root {
    --background: #f5f5f5;
  }

  .overlay {
    width: 100vw;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 0;
  }
  .overlay .background {
    width: 100%;
    height: 100%;
    background-color: var(--background);
    opacity: 0.5;
    z-index: -1;
  }
  main {
    padding: 0;
    margin: 0;
  }
</style>
