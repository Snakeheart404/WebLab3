<script>
  import { Circle } from "svelte-loading-spinners";
</script>

<div class="loader">
  <Circle color="rgb(155 155 155)" />
</div>
<div><h1>Loading...</h1></div>

<style>
  :root {
    --background-loader: rgb(255 255 255 / 50%);
  }

  div {
    text-align: center;
  }

  .loader {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--background-loader);
  }
</style>
