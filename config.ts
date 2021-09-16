import { createBasicAuthMiddleware } from "donkey-gateway/build/middlewares/basicAuth";
import { Config, IMatcher } from "donkey-gateway/build/schema";

export function getConfig(): Config {
  const matchers: IMatcher[] = [
    // match the HTTP header Host: loadtest
    {
      hosts: ["loadtest"],
      upstream: "localhost",
      port: 8000,
      timeout: 3,
    },
    // match HTTP header Host: localhost and the /admin/ uri
    {
      hosts: ["localhost"],
      upstream: "example.com",
      // at least one uris should match. The match is done with startsWith
      uris: ["/admin/"],
      requestMiddlewares: [createBasicAuthMiddleware("admin", "1234")],
    },
    // match any leftover requests
    {
      upstream: "example.com",
    },
  ];
  return { matchers };
}
