<script>
  import { Queries } from "./helper/requests";
  import Loader from "./components/Loader.svelte";
  import LoaderAdd from "./components/LoaderAdd.svelte";
  import LoaderDelete from "./components/LoaderDelete.svelte";
  import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
  import { setClient, subscribe, mutation } from "svelte-apollo";
  import { WebSocketLink } from "@apollo/client/link/ws";
  import { errorMessage, loaderAddCount, loaderDeleteCount } from "./stores.js";

  let online;

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

  const client = createApolloClient();
  setClient(client);

  const frogsArray = subscribe(Queries.SUBSCRIPTION_AllFrogs);
  const newFrogInfo = {};
  const addFrogQuery = mutation(Queries.InsertRecord);
  const deleteRecordsQuery = mutation(Queries.DeleteRecords);

  const AddFrog = async () => {
    try {
      $loaderAddCount++;
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
      $loaderAddCount--;
    }
  };

  const RemoveFrogs = async id => {
    try {
      $loaderDeleteCount++;
      await deleteRecordsQuery({
        variables: {
          frogID: id,
        },
      });
      $errorMessage = "";
    } catch (e) {
      $errorMessage = `Error occurred: ${e.message}`;
    } finally {
      $loaderDeleteCount--;
    }
  };
</script>

<svelte:window bind:online />

<main>
  {#if online}
    {#if $frogsArray.loading}
      <Loader />
    {:else if $loaderAddCount}
      <LoaderAdd />
    {:else if $loaderDeleteCount}
      <LoaderDelete />
    {:else if $frogsArray.error}
      <h1>Error: {$frogsArray.error.message}</h1>
    {:else if $frogsArray.data}
      <input bind:value={newFrogInfo.name} placeholder="Name" />
      <input bind:value={newFrogInfo.count} placeholder="Count" />
      <button on:click={AddFrog}>Add frog</button>
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
              <td><button on:click={RemoveFrogs(frog.id)}>Delete</button></td>
            </tr>
          {/each}
        </table>
      {:else}
        <h1>No frogs</h1>
      {/if}
      <div class="errorLabel">{$errorMessage}</div>
    {/if}
  {:else}
    <div class="overlay">
      <h1>Internet connection is lost! :(</h1>
      <div class="overlay background" />
    </div>
  {/if}
</main>

<style>
  :root {
    --background: rgb(195 195 195);
  }

  main {
    padding: 0;
    margin: 0;
  }

  .overlay {
    position: fixed;
    z-index: 0;
    top: 0;
    left: 0;
    display: flex;
    width: 100vw;
    height: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .overlay .background {
    z-index: -1;
    width: 100%;
    height: 100%;
    background-color: var(--gray-bg);
    opacity: 0.5;
  }
</style>
