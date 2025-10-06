<script>
  import { IconCardsFilled, IconUser } from "@tabler/icons-svelte";

  let activeTab = "home";
  let userMenuOpen = false;
</script>

<!-- Top Navigation -->
<nav class="navbar">
  <div class="navbar-content">
    <!-- Logo and Main Nav -->
    <div class="navbar-left">
      <!-- Logo -->
      <div class="logo">
        <IconCardsFilled size={32} />
        <span class="logo-text">DraftBox</span>
      </div>

      <!-- Navigation Links -->
      <div class="nav-links">
        <button on:click={() => (activeTab = "home")} class="nav-link {activeTab === 'home' ? 'active' : ''}"> Home </button>
        <button on:click={() => (activeTab = "inventory")} class="nav-link {activeTab === 'inventory' ? 'active' : ''}"> Inventory </button>
        <button on:click={() => (activeTab = "builder")} class="nav-link {activeTab === 'builder' ? 'active' : ''}"> Deck Builder </button>
      </div>
    </div>

    <!-- User Menu -->
    <div class="user-menu-wrapper">
      <button on:click={() => (userMenuOpen = !userMenuOpen)} class="user-avatar">
        <div class="avatar-circle">
          <IconUser size={20} class="avatar-icon" />
        </div>
      </button>

      <!-- Dropdown Menu -->
      {#if userMenuOpen}
        <div class="dropdown-menu">
          <button class="dropdown-item">Settings</button>
          <button class="dropdown-item">Admin Panel</button>
          <hr />
          <button class="dropdown-item danger">Logout</button>
        </div>
      {/if}
    </div>
  </div>
</nav>

<style>
  /* .app-container {
    min-height: 100vh;
    background: var(--color-bg);
  } */

  /* Navbar */
  .navbar {
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .navbar-content {
    max-width: 75rem;
    margin: 0 auto;
    padding: 0 var(--space-lg);
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 4rem;
  }

  .navbar-left {
    display: flex;
    align-items: center;
    gap: var(--space-2xl);
  }

  /* Logo */
  .logo {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    color: var(--color-primary);
  }

  .logo-text {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text);
  }

  /* Navigation Links */
  .nav-links {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
  }

  .nav-link {
    padding: var(--space-sm) var(--space-md);
    border-radius: var(--radius);
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text-muted);
    background: transparent;
    border: none;
    cursor: pointer;
    transition: var(--transition);
  }

  .nav-link:hover {
    color: var(--color-text);
    background: var(--color-bg);
    transform: none;
    box-shadow: none;
  }

  .nav-link.active {
    background: var(--color-bg);
    color: var(--color-text);
  }

  /* User Menu */
  .user-menu-wrapper {
    position: relative;
  }

  .user-avatar {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-sm);
    border-radius: 9999px;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: var(--transition);
  }

  .user-avatar:hover {
    background: var(--color-bg);
    transform: none;
    box-shadow: none;
  }

  .avatar-circle {
    width: 2rem;
    height: 2rem;
    background: linear-gradient(135deg, #3b82f6 0%, #9333ea 100%);
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :global(.avatar-icon) {
    color: white;
  }

  /* Dropdown Menu */
  .dropdown-menu {
    position: absolute;
    right: 0;
    top: calc(100% + var(--space-sm));
    width: 12rem;
    background: var(--color-surface);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    border: 1px solid var(--color-border);
    padding: var(--space-xs);
    z-index: 1000;
  }

  .dropdown-item {
    width: 100%;
    text-align: left;
    padding: var(--space-sm) var(--space-md);
    font-size: 0.875rem;
    color: var(--color-text);
    background: transparent;
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: var(--transition);
    font-weight: normal;
  }

  .dropdown-item:hover {
    background: var(--color-bg);
    transform: none;
    box-shadow: none;
  }

  .dropdown-item.danger {
    color: var(--color-danger);
  }

  .dropdown-menu hr {
    margin: var(--space-xs) 0;
  }

  @media (max-width: 768px) {
    .nav-links {
      display: none;
    }
  }
</style>
