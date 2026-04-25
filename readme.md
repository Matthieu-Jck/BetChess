# BetChess

## Introduction
BetChess is a multiplayer chess variant where each turn ends with a prediction. After making your move, you bet on the opponent's next one. Guess correctly, and your following turn includes an extra move.

## How to Play
### Rules
- Each turn consists of two phases:
  1. **Move**: Make your standard chess move.
  2. **Predict**: Predict your opponent's next move.
- If you predict correctly, you earn the right to make two consecutive moves on your next turn.
- If your opponent earns a bonus turn, your prediction succeeds if it matches either move they make.

## Deployment
This repository includes a Fly.io deployment workflow at `.github/workflows/fly.yml`.

To enable automatic deployment from GitHub:

1. Create a Fly app and keep its app name handy.
2. Add a repository secret named `FLY_API_TOKEN`.
3. Add a repository variable named `FLY_APP_NAME`.
4. Push to `main`.
