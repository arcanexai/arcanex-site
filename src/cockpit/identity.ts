import netlifyIdentity from "netlify-identity-widget";

// Normalize both "#invite_token=..." and "#/invite_token=..."
const h = location.hash || "";
const m = h.match(/invite_token=([^&]+)/);
if (/#\/invite_token=/.test(h) && m) {
  location.replace("#invite_token=" + m[1]);
}

netlifyIdentity.on("init", (user) => {
  const hasInvite = (location.hash || "").includes("invite_token");
  if (!user && hasInvite) {
    netlifyIdentity.open("signup"); // open password set flow
  }
});
netlifyIdentity.on("login", () => location.reload());
netlifyIdentity.init();