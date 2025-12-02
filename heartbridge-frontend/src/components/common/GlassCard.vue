<template>
  <div
      class="glass-card relative overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"
      :class="[
      hover? 'hover:-translate-y-1 hover:shadow-xl' : '',
      'bg-white/60 dark:bg-[#1c1c1e]/60',
      'backdrop-blur-xl',
      'border border-white/40 dark:border-white/10',
      'shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-none',
      'rounded-2xl' // Apple squircle approximation
    ]"
  >
    <div class="relative z-10 h-full">
      <slot />
    </div>

    <div class="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
  </div>
</template>

<script setup lang="ts">
defineProps({
  hover: {
    type: Boolean,
    default: true
  }
})
</script>

<style scoped>
.glass-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(
      180deg,
      rgba(255,255,255,0.8) 0%,
      rgba(255,255,255,0.2) 100%
  );
  -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.dark.glass-card::before {
  background: linear-gradient(
      180deg,
      rgba(255,255,255,0.15) 0%,
      rgba(255,255,255,0.05) 100%
  );
}
</style>