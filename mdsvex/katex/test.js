import svelte from "rollup-plugin-svelte";
import { mdsvex } from "mdsvex";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export default {
  input: `test.svx`,
  output: {
    file: `output.js`,
    format: "iife"
  },
  plugins: [
    svelte({
      extensions: [".svelte", ".svx"],
      preprocess: mdsvex({
        remarkPlugins: [
          remarkMath,
        ],
        rehypePlugins: [
          [rehypeKatex, {output: 'html'}],
        ],
      })
    })
  ]
};
