# Chat App Client (FE)

## Tech Stack

Vite + pnpm + shadcn/ui + tailwind

## Run

Duplicate `.env.sample` file and rename the copy to `.env`. Then run the following commands from the root of the project folder:

```bash
pnpm install
pnpm run dev
```

## Test

We want to introduce E2E tests by feature/page to enable regression testing of the most critical modules.
Open two separate browser windows and visit the website on localhost. Once you enter your name, you can exchange messages between the two clients.

## Next Steps

### Product

- Improve messages design
- Add animations and sound effects
- Display more details about user activity (beyond messaging, fx typing.., who is active in a channel etc.)

### Tech

- Improve code modularity
- Introduce test setup
- Dockerize
- Introduce controlled techdebt (TODOs linked with ticket url)
- Implement CI/CD pipeline to enable iterative development
