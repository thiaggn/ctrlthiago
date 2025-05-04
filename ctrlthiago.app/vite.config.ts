import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		proxy: {
			'/api': 'https://mock-823b421310274426be4e3a0368144bb6.mock.insomnia.rest'
		}
	}
});
