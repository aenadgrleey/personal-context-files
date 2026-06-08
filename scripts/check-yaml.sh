#!/usr/bin/env bash
set -euo pipefail

yamllint \
  .yamllint \
  checks.yaml \
  .rtango/spec.yaml \
  collections/*.yaml
