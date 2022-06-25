import Document, { Html, Head, Main, NextScript } from "next/document";
import appConfig from "../app.json";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    const bodyId = Math.random()
      .toString(36)
      .replace("0.", "__root_" || "");

    const basePath = appConfig.basePath || "";
    let faviconUrl = basePath + appConfig.favicon;
    if (process.env.NODE_ENV !== "production") {
      faviconUrl += "?t=" + new Date().getTime();
    }
    return (
      <Html>
        <Head />
        <meta name="theme-color" content="#ffffff" />
        <link rel="shortcut icon" href={faviconUrl} type="image/png"></link>
        <link rel="icon" href={faviconUrl} type="image/png"></link>
        <body id={`${bodyId}__`}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
