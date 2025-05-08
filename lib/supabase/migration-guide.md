# Supabase Migration Guide for 8gentc

This document outlines the process for managing database migrations, seeding test data, and version control of the database for the 8gentc platform.

## Table of Contents

1. [Introduction](#introduction)
2. [Development Workflow](#development-workflow)
3. [Migration Commands](#migration-commands)
4. [Seeding Data](#seeding-data)
5. [Rollback Procedures](#rollback-procedures)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

## Introduction

Migrations allow us to apply schema changes to our database in a structured, repeatable way. The 8gentc platform uses Supabase's migration system to manage schema changes, ensuring consistency across all environments.

## Development Workflow

The typical workflow for making database changes is:

1. **Make local schema changes**: Modify the schema in your local development environment
2. **Create a migration**: Use `npx supabase db diff` to generate a migration file
3. **Test the migration**: Apply and verify the migration works locally
4. **Commit the migration**: Add the migration file to version control
5. **Apply to other environments**: Push the migration to staging/production environments

## Migration Commands

### Initialize Supabase for Local Development

```bash
# Initialize the Supabase configuration for this project
npx supabase init

# Start the local Supabase instance
npx supabase start
```

### Create a New Migration

```bash
# Generate a migration file from local schema changes
npx supabase db diff -f migration_name

# Alternatively, create an empty migration file to edit manually
npx supabase migration new migration_name
```

### Apply Migrations

```bash
# Apply migrations to the local development database
npx supabase db reset

# Apply migrations to a remote environment (staging/production)
npx supabase db push --linked
```

### View Migration Status

```bash
# List all migrations and their status
npx supabase migration list --linked
```

### Schema Management

```bash
# Dump the current schema to a file
npx supabase db dump -f schema.sql

# Compare local schema with remote
npx supabase db diff --linked
```

## Seeding Data

We have a seed file located at `lib/supabase/seed.sql` for populating the database with test data.

```bash
# To apply seed data to the local database after reset
npx supabase db reset

# To apply seed data to a linked project (usually just for dev/staging)
npx supabase db push --linked --include-seed
```

The seed data includes:
- Sample user profiles
- Example projects
- Plan sections
- Conversations and messages
- Sample graph nodes and edges
- Example diagrams
- Insights

## Rollback Procedures

If a migration fails or causes issues in production, you can roll back using the following procedures:

### Automatic Rollback (for simple cases)

```bash
# Reset the database to a specific migration version
npx supabase db reset --version <previous_version>
```

### Manual Rollback (for complex cases)

1. Create a new migration file that reverts the changes from the problematic migration
2. Apply the new rollback migration
3. Mark the problematic migration as reverted in the migration history

```bash
# Mark a migration as reverted without running it
npx supabase migration repair <timestamp> --status reverted
```

## Best Practices

1. **Keep migrations small**: Smaller, focused migrations are easier to test and roll back
2. **Write idempotent migrations**: Use `IF EXISTS` and `IF NOT EXISTS` clauses
3. **Validate with tests**: Test migrations against sample data
4. **Include comments**: Document complex migrations for future reference
5. **Never edit applied migrations**: Create new migrations to modify existing schema
6. **Version control**: Always commit migration files to your repository

## Troubleshooting

### Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| Migration conflicts | Use `migration repair` to fix history discrepancies |
| Failed migration | Use the rollback procedure and fix the issue in a new migration |
| Schema drift | Use `db diff` to identify and resolve differences |

### Migration Error Resolution

If a migration fails, you'll typically see an error message from Postgres. Here's how to address common errors:

1. **Relation already exists**: Check if you need to add `IF NOT EXISTS` clause
2. **Relation doesn't exist**: Ensure you're running migrations in the right order
3. **Permission denied**: Check RLS policies and user privileges
4. **Constraint violation**: Data may not match the new schema constraints 