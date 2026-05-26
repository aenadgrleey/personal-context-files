# Use a stable Ubuntu base image
FROM ubuntu:22.04

# Prevent interactive prompts during apt installations
ENV DEBIAN_FRONTEND=noninteractive

# Install essential tools the agent might need (Git, Node, etc.)
RUN apt-get update && apt-get install -y \
    curl \
    git \
    python3 \
    jq \
    sudo \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 20 (LTS) via NodeSource
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Install pi coding agent globally
RUN npm install -g @mariozechner/pi-coding-agent

# Create a non-root user "pi"
ARG USERNAME=pi
ARG USER_UID=1000
ARG USER_GID=1000

RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME -s /bin/bash \
    && echo "$USERNAME ALL=(root) NOPASSWD:ALL" > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

# Create workspace and adjust permissions
RUN mkdir -p /workspace && chown $USER_UID:$USER_GID /workspace

# Set environment variables for Android SDK, Java, and npm global prefix
ENV ANDROID_HOME=/android-sdk
ENV JAVA_HOME=/jdk
ENV NPM_CONFIG_PREFIX=/home/pi/.npm-global
ENV PATH=/home/pi/.npm-global/bin:$JAVA_HOME/bin:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH

# Create npm global directory and set permissions
RUN mkdir -p /home/pi/.npm-global && chown $USER_UID:$USER_GID /home/pi/.npm-global

# Copy and setup entrypoint script
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

USER $USERNAME
WORKDIR /workspace

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# Keep the container alive for the agent to run commands interactively
CMD ["tail", "-f", "/dev/null"]
