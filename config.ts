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
    // match HTTP header Host: localhost:3000 and the /admin/ uri
    {
      hosts: ["localhost:3000"],
      upstream: "example.com",
      uris: ["/admin/"],
      requestMiddlewares: [createBasicAuthMiddleware("admin", "1234")],
      stripUri: true,
    },
    // match any leftover requests
    {
      upstream: "example.com",
    },
  ];
  return { matchers };
}
