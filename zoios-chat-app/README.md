# Chat App Server (BE)

## Tech Stack

Deno + Postgres

## Run

```bash
deno run dev
```

## Test

Testing strategy is to focus on unit tests as those can capture issues early on. We want to keep the tests as close to the code they test as possible. Mocking and dependency injection/inversion are principles to be followed. TDD would be a great approach to introduce - but its not as easy to stick to it as it sounds. I've developed a custom test-framework built on top of `jest` that nicely supports this strategy (out of scope here).

## Next Steps

### Product

- Capture more relevant data about the users, fx
- Registration, Login
- Creating private/public channels

### Tech

- Complete migrations setup (currently blocks testing)
- Improve code modularity - handlers, domains, services
- More robust testing - unit, integration, E2E tests
- Input validation
- Dockerize
- Implement CI/CD pipeline to enable iterative development
