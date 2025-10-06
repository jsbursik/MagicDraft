<script lang="ts">
  import { authClient } from "$lib/auth-client";
  import { goto } from "$app/navigation";

  let email = "";
  let password = "";
  let error = "";
  let loading = false;

  async function handleLogin() {
    loading = true;
    error = "";

    try {
      await authClient.signIn.email({
        email,
        password,
      });

      // Redirect after successful login
      goto("/");
    } catch (e: any) {
      error = e.message || "Login failed";
    } finally {
      loading = false;
    }
  }
</script>

<div class="auth-container">
  <h1>Log In</h1>

  <form on:submit|preventDefault={handleLogin}>
    <div>
      <label for="email">Email</label>
      <input id="email" type="email" bind:value={email} required />
    </div>

    <div>
      <label for="password">Password</label>
      <input id="password" type="password" bind:value={password} required />
    </div>

    {#if error}
      <p class="error">{error}</p>
    {/if}

    <button type="submit" disabled={loading}>
      {loading ? "Logging in..." : "Log In"}
    </button>
  </form>

  <p>
    Don't have an account? <a href="/signup">Sign up</a>
  </p>
</div>

<style>
  .auth-container {
    max-width: 400px;
    margin: 2rem auto;
    padding: 2rem;
  }

  form > div {
    margin-bottom: 1rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
  }

  input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  button {
    width: 100%;
    padding: 0.75rem;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .error {
    color: red;
    margin: 1rem 0;
  }
</style>
