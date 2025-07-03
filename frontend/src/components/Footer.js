import React from "react";

const githubs = [
  {
    name: "Nazmi Cirim",
    url: "https://github.com/ncrim7",
  },
  {
    name: "Ali Erdem Baltacı",
    url: "https://github.com/erdembaltaci",
  },
];

const githubLogo = (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" style={{marginRight:8}}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.58 2 12.26c0 4.48 2.87 8.28 6.84 9.63.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05A9.38 9.38 0 0 1 12 6.84c.85.004 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" fill="#181717"/>
  </svg>
);

const Footer = () => (
  <footer style={{
    width: "100%",
    background: "#f3f4f6",
    borderTop: "1.5px solid #e5e7eb",
    marginTop: 85,
    padding: "24px 0 16px 0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontSize: 16,
    color: "#22223b"
  }}>
    <div style={{display: "flex", alignItems: "center", gap: 18}}>
      {githubs.map((g, i) => (
        <a key={i} href={g.url} target="_blank" rel="noopener noreferrer" style={{display: "flex", alignItems: "center", textDecoration: "none", color: "#181717", fontWeight: 600, marginRight: 18}}>
          {githubLogo}
          {g.name}
        </a>
      ))}
    </div>
    <div style={{marginTop: 8, fontSize: 13, color: "#6b7280"}}>
      © {new Date().getFullYear()} QuizMaster. Tüm hakları saklıdır.
    </div>
  </footer>
);

export default Footer;
