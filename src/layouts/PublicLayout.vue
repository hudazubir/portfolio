<script setup>
import SiteHeader from '@/components/SiteHeader.vue'
</script>

<template>
  <div class="min-h-screen overflow-clip">
    <SiteHeader />

    <main>
      <RouterView />
    </main>

    <footer class="border-t border-border">
      <div
        class="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8"
      >
        <p>© {{ new Date().getFullYear() }} DevVault. Built with Vue.</p>

        <div class="flex items-center gap-5">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            class="font-medium transition hover:text-foreground motion-reduce:transition-none"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            class="font-medium transition hover:text-foreground motion-reduce:transition-none"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>
