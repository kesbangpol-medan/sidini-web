#!/bin/bash

REPO="celpung/sidini_service"
ENVIRONMENT="production"

echo "🚀 Uploading secrets to GitHub repo: $REPO"
ENV_FILE_SECRETS=".env.github"
if [[ -f "$ENV_FILE_SECRETS" ]]; then
  while IFS='=' read -r key value || [[ -n "$key" ]]; do
    if [[ ! "$key" =~ ^# && -n "$key" ]]; then
      echo "🔐 Setting secret: $key"
      gh secret set "$key" -b"$value" -R "$REPO"
    fi
  done < "$ENV_FILE_SECRETS"
else
  echo "⚠️  File $ENV_FILE_SECRETS tidak ditemukan."
fi

echo "📦 Uploading variables to environment: $ENVIRONMENT in repo: $REPO"
ENV_FILE_VARS=".env.variables"
if [[ -f "$ENV_FILE_VARS" ]]; then
  while IFS='=' read -r key value || [[ -n "$key" ]]; do
    if [[ ! "$key" =~ ^# && -n "$key" ]]; then
      echo "📘 Setting variable: $key"
      gh variable set "$key" -b"$value" --env "$ENVIRONMENT" -R "$REPO"
    fi
  done < "$ENV_FILE_VARS"
else
  echo "⚠️  File $ENV_FILE_VARS tidak ditemukan."
fi

echo "✅ Upload complete!"
