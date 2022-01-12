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
    addFrogDisabled = true;
    $loadersCount++;
    const { name, count } = newFrogInfo;
    if (!name || !count) {
      addFrogDisabled = false;
      $errorMessage = "Name and count are required!";
      $loadersCount--;
      return;
    }
    if (count < 0) {
      addFrogDisabled = false;
      $errorMessage = "Count must be >=0!";
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

  const RemoveFrogs = async id => {
    removeFrogDisabled = true;
    $loadersCount++;
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
      $loadersCount--;
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

    {#if $frogsArray.data.FrogsDB_frogs.length != 0}
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
    <img src="img/cement.png" alt="не спрашивайте..." class="meme" />
  {/if}
</main>

<style>
  :root {
    --background: hsl(60deg 100% 95%);
  }

  .overlay {
    position: fixed;
    z-index: 0;
    top: 0;
    left: 0;
    display: flex;
    width: 100vw;
    height: 100%;
    align-items: center;
    justify-content: center;
  }

  .overlay .background {
    z-index: -1;
    width: 100%;
    height: 100%;
    background-color: var(--background);
    opacity: 0.5;
  }

  .visible {
    visibility: hidden;
  }

  .meme {
    position: fixed;
    z-index: -10;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    animation-duration: 3s;
    animation-iteration-count: infinite;
    animation-name: slab;
  }

  @keyframes slab {
    0% {
      top: 0;
      left: 0;
      animation-timing-function: ease-in;
    }

    25% {
      top: 100%;
      left: 0;
      animation-timing-function: ease-in;
    }

    50% {
      top: 100%;
      left: 100%;
      animation-timing-function: ease-in;
      transform: transform(100%, 100%);
    }

    75% {
      top: 0%;
      left: 100%;
      animation-timing-function: ease-in;
      transform: transform(100%, 100%);
    }

    100% {
      top: 0%;
      left: 0%;
      animation-timing-function: ease-in;
      transform: transform(100%, 0);
    }
  }

  main {
    padding: 0;
    margin: 0;
  }
</style>
