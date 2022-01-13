<script>
  import { Queries } from "./helper/requests";
  import Loader from "./components/Loader.svelte";
  import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
  import { setClient, subscribe, mutation } from "svelte-apollo";
  import { WebSocketLink } from "@apollo/client/link/ws";
  import { errorMessage, loadersCount } from "./stores.js";

  function createApolloClient() {
    const wsLink = new WebSocketLink({
      uri: uri_from_env,
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
    try {
      addFrogDisabled = true;
      const { name, count } = newFrogInfo;
      if (!name || !count) {
        throw Error("Name and count are required!");
      }
      if (count < 0) {
        throw Error("Count must be >=0!");
      }
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
    }
  };

  const RemoveFrogs = async id => {
    removeFrogDisabled = true;
    try {
      await deleteRecordsQuery({
        variables: {
          frogID: id,
        },
      });
      $errorMessage = "";
    } catch (e) {
      $errorMessage = `Error occurred: ${e.message}`;
    } finally {
      removeFrogDisabled = false;
    }
  };
</script>

<main>
  {#if $frogsArray.loading}
    <Loader />
  {:else if $frogsArray.error}
    <h1>Error: {$frogsArray.error.message}</h1>
  {:else if $frogsArray.data}
    <input bind:value={newFrogInfo.name} placeholder="Name" />
    <input bind:value={newFrogInfo.count} placeholder="Count" />
    <button on:click={AddFrog} disabled={addFrogDisabled}>Add frog</button>

    {#if $frogsArray.data.FrogsDB_frogs.length != 0 && $frogsArray.data.FrogsDB_frogs}
      <table border="1">
        <caption>Frogs</caption>
        <tr>
          <th>Name</th>
          <th>Count</th>
          <th>Deletion</th>
        </tr>
        {#each $frogsArray.data.FrogsDB_frogs as frog (frog.id)}
          <tr>
            <td>{frog.name}</td>
            <td>{frog.count}</td>
            <td
              ><button
                on:click={RemoveFrogs(frog.id)}
                disabled={removeFrogDisabled}>Delete</button
              ></td
            >
          </tr>
        {/each}
      </table>
    {:else}
      <h1>No frogs</h1>
    {/if}
    <div class="errorLabel">{$errorMessage}</div>
    <div class="overlay" class:visible={!$loadersCount}>
      <Loader />
      <div class="overlay background" />
    </div>
  {/if}
</main>

<style>
  .visible {
    visibility: hidden;
  }

  main {
    padding: 0;
    margin: 0;
  }
</style>
