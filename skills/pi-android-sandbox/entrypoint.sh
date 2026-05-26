#!/bin/bash
# entrypoint.sh

# Configure Git credentials globally for the pi user if tokens are provided
if [ -n "$GITHUB_TOKEN" ]; then
    git config --global credential.https://github.com.username git
    git config --global credential.https://github.com.helper "!f() { test \"\$1\" = get && echo \"password=${GITHUB_TOKEN}\"; }; f"
fi

if [ -n "$GITLAB_TOKEN" ]; then
    git config --global credential.https://gitlab.com.username oauth2
    git config --global credential.https://gitlab.com.helper "!f() { test \"\$1\" = get && echo \"password=${GITLAB_TOKEN}\"; }; f"
fi

# Remove the tokens from the environment so they don't show up when the agent runs `env`
unset GITHUB_TOKEN
unset GITLAB_TOKEN

# Execute the container's main command
exec "$@"
