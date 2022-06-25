module.exports = {
  presets: [["next/babel", { "preset-react": { runtime: "automatic" } }]],
  plugins: [
    "babel-plugin-macros",
    [
      "styled-components",
      {
        ssr: false,
        displayName: false,
        minify: true,
        transpileTemplateLiterals: true,
      },
    ],
  ],
};
