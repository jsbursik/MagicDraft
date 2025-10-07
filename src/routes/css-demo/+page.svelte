<script>
  import ModeToggle from "$components/mode-toggle.svelte";
  import { toast } from "$lib/stores/toast";
</script>

<div class="center">
  <header class="center-text">
    <h1>Semantic CSS Framework</h1>
    <p>A lightweight, semantic-first CSS framework that makes HTML beautiful by default.</p>
  </header>

  <hr />

  <!-- Typography Demo -->
  <section>
    <h2>Typography</h2>
    <p>
      This framework provides beautiful typography out of the box. All heading levels are styled with proper hierarchy, and body text has comfortable
      line-height and spacing.
    </p>

    <h3>Heading Level 3</h3>
    <h4>Heading Level 4</h4>
    <h5>Heading Level 5</h5>
    <h6>Heading Level 6</h6>

    <p>
      You can use <strong>bold text</strong>, <em>italic text</em>, and <a href="#">links</a> that have smooth hover effects. There's also
      <code>inline code</code> for technical content.
    </p>

    <blockquote>"This is a blockquote. It's perfect for highlighting important quotes or testimonials."</blockquote>

    <pre><code
        >{@html `// Code blocks look great too
function hello() {
  console.log('Hello, world!');
}`}</code
      ></pre>
  </section>

  <hr />

  <!-- Cards Demo -->
  <section>
    <h2>Cards</h2>
    <p>Cards are one of the few utility classes. They're perfect for grouping related content.</p>

    <div class="grid">
      <div class="card">
        <h3>Feature One</h3>
        <p>Cards have subtle shadows and hover effects. They're responsive and stack nicely on mobile.</p>
        <div class="cluster">
          <span class="badge-primary badge">New</span>
          <span class="badge">Popular</span>
        </div>
      </div>

      <div class="card">
        <h3>Feature Two</h3>
        <p>Use the grid class to create responsive layouts. It automatically adjusts based on screen size.</p>
        <button>Learn More</button>
      </div>

      <div class="card">
        <h3>Feature Three</h3>
        <p>Everything is built with CSS variables, so customization is as simple as changing a few values.</p>
        <button>Get Started</button>
      </div>
    </div>
  </section>

  <hr />

  <!-- Alerts Demo -->
  <section>
    <h2>Alerts</h2>

    <div class="alert alert-info">
      <strong>Info:</strong> This is an informational message with a left border accent.
    </div>

    <div class="alert alert-success">
      <strong>Success:</strong> Your changes have been saved successfully!
    </div>

    <div class="alert alert-warning">
      <strong>Warning:</strong> Please review your input before submitting.
    </div>

    <div class="alert alert-danger">
      <strong>Error:</strong> Something went wrong. Please try again.
    </div>
  </section>

  <hr />

  <!-- Buttons Demo -->
  <section>
    <h2>Buttons</h2>

    <button>Default</button>
    <button class="btn-success">Success</button>
    <button class="btn-warning">Warning</button>
    <button class="btn-danger">Danger</button>
  </section>

  <hr />

  <!-- Toast Demo -->

  <section>
    <h2>Toasts</h2>
    <button onclick={() => toast.show("Info!", "info")}>Info</button>
    <button onclick={() => toast.show("Success!", "success")} class="btn-success">Success</button>
    <button onclick={() => toast.show("Warning!", "warning")} class="btn-warning">Warning</button>
    <button onclick={() => toast.show("Danger!", "danger")} class="btn-danger">Danger</button>
    <button onclick={() => toast.show("Long delay", "info", 100000)}>Long Delay</button>
  </section>

  <hr />

  <!-- Forms Demo -->
  <section>
    <h2>Forms</h2>
    <p>Form elements are styled beautifully with no classes needed.</p>

    <div class="card">
      <form class="stack">
        <div>
          <label for="name">Full Name</label>
          <input type="text" id="name" placeholder="Enter your name" />
        </div>

        <div>
          <label for="email">Email Address</label>
          <input type="email" id="email" placeholder="you@example.com" />
        </div>

        <div>
          <label for="subject">Subject</label>
          <select id="subject">
            <option>General Inquiry</option>
            <option>Support Request</option>
            <option>Feedback</option>
          </select>
        </div>

        <div>
          <label for="message">Message</label>
          <textarea id="message" rows="4" placeholder="Tell us what's on your mind..."></textarea>
        </div>

        <fieldset>
          <legend>Preferences</legend>
          <div class="stack-sm">
            <label>
              <input type="checkbox" checked />
              Subscribe to newsletter
            </label>
            <label>
              <input type="checkbox" />
              Send me product updates
            </label>
          </div>
        </fieldset>

        <div class="cluster">
          <button type="submit">Submit Form</button>
          <button type="button" disabled>Disabled Button</button>
        </div>
      </form>
    </div>
  </section>

  <hr />

  <!-- Table Demo -->
  <section>
    <h2>Tables</h2>
    <p>Tables have hover effects and proper spacing automatically.</p>

    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Status</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Semantic Framework</td>
          <td><span class="badge-success badge">Active</span></td>
          <td>Free</td>
        </tr>
        <tr>
          <td>Premium Components</td>
          <td><span class="badge-warning badge">Beta</span></td>
          <td>$29</td>
        </tr>
        <tr>
          <td>Enterprise License</td>
          <td><span class="badge badge">Coming Soon</span></td>
          <td>$299</td>
        </tr>
      </tbody>
    </table>
  </section>

  <hr />

  <!-- Layout Utilities Demo -->
  <section>
    <h2>Layout Utilities</h2>

    <h3>Stack (Vertical Spacing)</h3>
    <div class="card stack">
      <p>The stack utility adds consistent vertical spacing between elements.</p>
      <p>No need to add margins to individual elements.</p>
      <p>It just works automatically.</p>
    </div>

    <h3>Cluster (Horizontal Spacing)</h3>
    <div class="card">
      <div class="cluster">
        <button>Action 1</button>
        <button>Action 2</button>
        <button>Action 3</button>
        <span class="badge-primary badge">New</span>
        <span class="badge-success badge">Updated</span>
      </div>
    </div>

    <h3>Grid</h3>
    <p>The grid utility creates responsive columns that automatically adjust.</p>
  </section>

  <hr />

  <footer class="center-text">
    <p><small>Built with semantic HTML and zero JavaScript. Customize it however you like!</small></p>
  </footer>
</div>
