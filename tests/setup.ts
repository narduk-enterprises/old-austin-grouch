import { vi } from 'vitest';

// Expose standard Vue composition APIs for tests
import { ref, computed, reactive } from 'vue';

(global as any).ref = ref;
(global as any).computed = computed;
(global as any).reactive = reactive;

// Add generic mocks for Nuxt composables if needed by components
(global as any).useRoute = vi.fn(() => ({
  path: '/',
  query: {},
  params: {}
}));

(global as any).useRouter = vi.fn(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
}));

(global as any).useAuth = vi.fn(() => ({
  user: computed(() => null),
  loggedIn: computed(() => false),
  login: vi.fn(),
  logout: vi.fn(),
}));

(global as any).useToast = vi.fn(() => ({
  add: vi.fn(),
  clear: vi.fn(),
}));
