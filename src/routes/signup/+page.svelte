<script lang="ts">
  import { authClient } from "$lib/auth-client";
  import { goto } from "$app/navigation";
  import Input from "$components/form-components/input.svelte";
  import { toast } from "$lib/stores/toast";

  let formValues = $state({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  let formValidity = $state({
    name: false,
    email: false,
    password: false,
    passwordConfirm: false,
  });

  let passMatch = $state(true);
  let isValid = $derived(Object.values(formValidity).every((v) => v) && passMatch);

  let loading = $state(false);

  async function handleSignup() {
    loading = true;
    let name = formValues.name;
    let email = formValues.email;
    let password = formValues.password;

    try {
      await authClient.signUp.email({
        email,
        password,
        name,
      });

      // Redirect to home or dashboard after signup
      toast.show("Account created Successfully!", "success");
      goto("/login");
    } catch (e: any) {
      toast.show(e.message || "Signup failed", "danger");
    } finally {
      loading = false;
    }
  }

  function handlePassMatch() {
    if (formValues.passwordConfirm.length > 0) {
      passMatch = formValues.password === formValues.passwordConfirm;
    }
  }
</script>

<div class="auth-container">
  <div class="card">
    <form class="stack" onsubmit={handleSignup}>
      <h1 class="center-text">Sign Up</h1>
      <div>
        <label for="name">Name</label>
        <Input type="text" name="name" id="name" bind:value={formValues.name} bind:valid={formValidity.name} placeholder="Enter your name or handle" required />
      </div>
      <div>
        <label for="email">Email</label>
        <Input type="email" name="email" id="email" bind:value={formValues.email} bind:valid={formValidity.email} placeholder="email@example.com" required />
      </div>
      <div>
        <label for="password">Password</label>
        <Input
          type="password"
          name="password"
          id="password"
          bind:value={formValues.password}
          bind:valid={formValidity.password}
          placeholder="Enter your password"
          required
        />
      </div>
      <div>
        <label for="password-confirm">Confirm Password</label>
        <Input
          type="password"
          name="password-confirm"
          id="password-confirm"
          bind:value={formValues.passwordConfirm}
          bind:valid={formValidity.passwordConfirm}
          placeholder="Confirm your password"
          onInput={handlePassMatch}
          required
        />
      </div>
      {#if !passMatch}
        <p class="error center-text">Passwords don't match</p>
      {/if}
      <div>
        <button type="submit" class="m-auto w-100" disabled={!isValid}>Sign Up</button>
      </div>
    </form>
  </div>
  <div class="center-text">
    <a href="/login">Already have an account?</a>
  </div>
</div>

<style>
  .auth-container {
    max-width: 400px;
    margin: 2rem auto;
    padding: 2rem;
  }

  .error {
    font-size: 0.8rem;
    color: var(--color-danger);
    margin: 1rem 0;
  }
</style>
