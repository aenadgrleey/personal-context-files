---
name: pi-android-sandbox
description: Setup pi sandbox for android (kmp) project
---

# Android & Java Sandbox

This skill provides a dedicated Docker sandbox for all Java and Android development tasks to ensure environment consistency and security.

## Agent Instructions: Initialization

1. **Verify SDK and JDK Paths:** Check if the host's `ANDROID_HOME` and `JAVA_HOME` environment variables are set. If not, check if the default Mac fallback paths in `docker-compose.yml` (`~/Library/Android/sdk` and `/Library/Java/JavaVirtualMachines/jdk-17.jdk/Contents/Home`) exist. If they do not match the user's system, **stop and prompt the user** for their correct Android SDK and JDK paths. Once provided, either export them temporarily or update `docker-compose.yml` with the correct paths.
2. **Check if `.env` exists:** Look for `.pi/skills/pi-android-sandbox/.env`.
3. **Prompt the User for Tokens:** If it does not exist, copy `.env.example` to `.env` and **stop and prompt the user** to fill in their Git tokens (`GITHUB_TOKEN` or `GITLAB_TOKEN`) if they need Git access inside the container.
4. **Start the Container:** Once paths are verified and `.env` is configured (or if the user skips tokens), ask the user for permission to start the sandbox using:
   ```bash
   docker-compose -f .pi/skills/pi-android-sandbox/docker-compose.yml --env-file .pi/skills/pi-android-sandbox/.env up -d --build
   ```
4. **Transition to the Sandbox:** After the container is successfully started, **suggest to the user that they should run the `pi` coding agent directly inside the container** to perform their tasks. Provide them with this command:
   ```bash
   docker exec -it pi-sandbox pi
   ```

## Agent Instructions: Shutting Down

When the task is complete, you should ask the user if they want to stop the container, and use:
```bash
docker-compose -f .pi/skills/pi-android-sandbox/docker-compose.yml down
```
*(Gradle caches will be safely preserved in a Docker volume for the next session).*
