<script lang="ts">
  import { authClient } from "$lib/auth-client";
  import { goto } from "$app/navigation";

  let email = $state("");
  let password = $state("");
  let error = $state("");
  let loading = false;

  let emailTouched = $state(false);
  let emailValidity = $state(false);
  let passTouched = $state(false);
  let passValidity = $state(false);

  async function handleLogin(e: Event) {
    e.preventDefault();
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
  <div class="card">
    <form class="stack" onsubmit={handleLogin}>
      <h1 class="center-text">Login</h1>
      <div>
        <label for="email">Email:</label>
        <input
          type="email"
          name="email"
          id="email"
          class:invalid={emailTouched && !emailValidity}
          bind:value={email}
          placeholder="email@example.com"
          required
          onblur={() => (emailTouched = true)}
          oninput={(e) => (emailValidity = e.currentTarget.checkValidity())}
        />
      </div>
      <div>
        <label for="password">Password:</label>
        <input
          type="password"
          name="password"
          id="password"
          class:invalid={passTouched && !passValidity}
          bind:value={password}
          placeholder="Enter your Password"
          required
          onblur={() => (passTouched = true)}
          oninput={(e) => (passValidity = e.currentTarget.checkValidity())}
        />
      </div>
      {#if error}
        <p class="error">{error}</p>
      {/if}
      <div>
        <button type="submit" class="m-auto w-100" style="margin-top: 1rem;">Login</button>
      </div>
    </form>
  </div>
  <div class="center-text">
    <a href="/signup">Don't have an account?</a>
  </div>
</div>

<style>
  .auth-container {
    max-width: 400px;
    margin: 2rem auto;
    padding: 2rem;
  }

  .error {
    color: red;
    margin: 1rem 0;
  }
</style>
