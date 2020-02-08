import { ref } from "./reactive/ref";
import { computed } from "./reactive/computed";
import { effect } from "./reactive/effect";

document.addEventListener("DOMContentLoaded", () => {
  const count = ref(0);
  const multiplied = computed(() => count.value * 2);

  const countElement = document.getElementById("count");
  const multipliedElement = document.getElementById("multiplied");
  const incrementButton = document.getElementById("increment");
  const decrementButton = document.getElementById("decrement");

  effect(() => {
    countElement!.innerText = String(count.value);
    multipliedElement!.innerText = String(multiplied.value);
  });

  incrementButton!.addEventListener("click", () => {
    count.value++;
  });
  decrementButton!.addEventListener("click", () => {
    count.value--;
  });
});
