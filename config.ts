import { createBasicAuthMiddleware } from "donkey-gateway/build/middlewares/basicAuth";
import { createRateLimitationMiddleware, RateLimitsOptions, } from "donkey-gateway/build/middlewares/rateLimit";
import { Config, IMatcher } from "donkey-gateway/build/schema";

export function getConfig(): Config {

  // example of different rate limitations
  const rateLimit: RateLimitsOptions = {
    // 10 seconds time window
    timeWindow: 10,
    setHeaders: true,
    keysLimits: (clientRequest) => {
      const userId = 123
      const orgId = 456
      return [
        // global limit of 10 req/s
        { key: 'global', limit: 10, name: "Global-2" },
        // organization specific limit of 5 req/s
        { key: `organisation-${orgId}`, limit: 5, name: "Org" },
        // user specific limit of 2 req/s
        { key: `user-${userId}`, limit: 2, name: "User" }
      ]
    }
  }

  const rateLimitationMiddleware = createRateLimitationMiddleware(rateLimit)

  const matchers: IMatcher[] = [
    // match the HTTP header Host: loadtest
    {
      hosts: ["loadtest"],
      upstream: "localhost",
      port: 8000,
      timeout: 3,
      requestMiddlewares: [rateLimitationMiddleware],
    },
    // match HTTP header Host: localhost:3000 and the /admin/ uri
    {
      hosts: ["localhost:3000"],
      upstream: "example.com",
      uris: ["/admin/"],
      requestMiddlewares: [createBasicAuthMiddleware("admin", "1234"), rateLimitationMiddleware],
      stripeUri: true,
    },
    // match any leftover requests
    {
      upstream: "example.com",
      requestMiddlewares: [rateLimitationMiddleware],
    },
  ];
  return { matchers };
}
