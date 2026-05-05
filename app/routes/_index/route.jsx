// import { redirect } from "react-router";
// import { login } from "../../shopify.server";
// import "../../css/app.css";

// export const loader = async ({ request }) => {
//   const url = new URL(request.url);

//   if (url.searchParams.get("shop")) {
//     throw redirect(`/app?${url.searchParams.toString()}`);
//   }

//   return { showForm: Boolean(login) };
// };

// export default function App() {
//   return (
//     <div
//       style={{
//         backgroundColor: "#001e3b",
//         height: "80vh",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         color: "white",
//       }}
//     >
//       <img
//         src="https://nameify.com/cdn/shop/files/New_Namify_Logo.png?v=1770660725&width=180"
//         style={{
//           objectFit: "contain",
//           width: "auto",
//           margin: "0 auto",
//           display: "block",
//         }}
//       />
//       <h2
//         style={{
//           letterSpacing: "0.09rem",
//           fontSize: "42px",
//           textAlign: "center",
//           marginBottom: "10px",
//           marginTop: "1rem",
//         }}
//       >
//         Worldwide Domain Marketplace
//       </h2>{" "}
//       <p
//         style={{
//           textAlign: "center",
//           maxWidth: "700px",
//           margin: "0 auto 30px auto",
//         }}
//       >
//         Explore a curated marketplace of premium domain names, carefully
//         selected <br />
//         for brandability, authority, and investment potential.
//       </p>
//       <a
//         href="https://nameify.com"
//         class="theme-btn-s2"
//         style={{
//           lineHeight: "24px",
//           display: "flex",
//           alignItems: "center",
//           textAlign: "center",
//           color: "#022344",
//           background: "#FF2EAE",
//           minWidth: "170px",
//           textDecoration: "none",
//           textAlign: "center",
//           borderRadius: "56px",
//           padding: "14px 20px",
//           fontWeight: "700",
//         }}
//       >
//         Explore Marketplace
//       </a>
//     </div>
//   );
// }

import { redirect, Form, useLoaderData } from "react-router";
import { login } from "../../shopify.server";
import styles from "./styles.module.css";

export const loader = async ({ request }) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return { showForm: Boolean(login) };
};

export default function App() {
  const { showForm } = useLoaderData();

  return (
    <div className={styles.index}>
      <div className={styles.content}>
        <h1 className={styles.heading}>A short heading about [your app]</h1>
        <p className={styles.text}>
          A tagline about [your app] that describes your value proposition.
        </p>
        {showForm && (
          <Form className={styles.form} method="post" action="/auth/login">
            <label className={styles.label}>
              <span>Shop domain</span>
              <input className={styles.input} type="text" name="shop" />
              <span>e.g: my-shop-domain.myshopify.com</span>
            </label>
            <button className={styles.button} type="submit">
              Log in
            </button>
          </Form>
        )}
        <ul className={styles.list}>
          <li>
            <strong>Product feature</strong>. Some detail about your feature and
            its benefit to your customer.
          </li>
          <li>
            <strong>Product feature</strong>. Some detail about your feature and
            its benefit to your customer.
          </li>
          <li>
            <strong>Product feature</strong>. Some detail about your feature and
            its benefit to your customer.
          </li>
        </ul>
      </div>
    </div>
  );
}
