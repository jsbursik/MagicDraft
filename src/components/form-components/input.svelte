<script lang="ts">
  let { type, name, id, placeholder, required = false, value = $bindable(""), valid = $bindable(false), onInput = () => {}, ...props } = $props();

  let touched = $state(false);
</script>

<input
  {type}
  {name}
  {id}
  {placeholder}
  {required}
  {...props}
  {value}
  class:invalid={touched && !valid}
  onblur={() => (touched = true)}
  oninput={(e) => {
    value = e.currentTarget.value;
    valid = e.currentTarget.checkValidity();
    onInput?.(e);
  }}
/>
