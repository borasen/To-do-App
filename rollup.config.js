import { spawn } from 'child_process';
import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import scss from 'rollup-plugin-scss'; // Import the scss plugin
import sveltePreprocess from 'svelte-preprocess'; // Import svelte-preprocess as default
import { terser } from 'rollup-plugin-terser'; // Import the terser plugin

const production = !process.env.ROLLUP_WATCH;

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = spawn('npm', ['run', 'start', '--', '--dev'], {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true
      });

      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    }
  };
}

export default {
  input: 'src/main.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/build/bundle.js'
  },
  plugins: [
    svelte({
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production
      },
      // Use sveltePreprocess as a function
      preprocess: sveltePreprocess(),
    }),
    // Add the scss plugin
    scss({
      output: 'public/build/bundle.css', // Specify the output file for compiled CSS
      failOnError: true // Stop the compilation process on error
    }),

    resolve({
      browser: true,
      dedupe: ['svelte'],
      exportConditions: ['svelte']
    }),
    commonjs(),

    // In dev mode, call the `serve` function
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload('public'),

    // If we're building for production, minify
    production && terser()
  ],
  watch: {
    clearScreen: false
  }
};
