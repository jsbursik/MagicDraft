<script lang="ts">
  import { authClient } from "$lib/auth-client";
  import { goto } from "$app/navigation";

  let email = "";
  let password = "";
  let name = "";
  let error = "";
  let loading = false;

  async function handleSignup() {
    loading = true;
    error = "";

    try {
      await authClient.signUp.email({
        email,
        password,
        name,
      });

      // Redirect to home or dashboard after signup
      goto("/");
    } catch (e: any) {
      error = e.message || "Signup failed";
    } finally {
      loading = false;
    }
  }
</script>

<div class="auth-container">
  <h1>Sign Up</h1>

  <form on:submit|preventDefault={handleSignup}>
    <div>
      <label for="name">Name</label>
      <input id="name" type="text" bind:value={name} required />
    </div>

    <div>
      <label for="email">Email</label>
      <input id="email" type="email" bind:value={email} required />
    </div>

    <div>
      <label for="password">Password</label>
      <input id="password" type="password" bind:value={password} required minlength="8" />
    </div>

    {#if error}
      <p class="error">{error}</p>
    {/if}

    <button type="submit" disabled={loading}>
      {loading ? "Creating account..." : "Sign Up"}
    </button>
  </form>

  <p>
    Already have an account? <a href="/login">Log in</a>
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
