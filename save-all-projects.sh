#!/bin/bash

# Script to save (commit and optionally push) changes across all Git projects
# Usage: ./save-all-projects.sh [commit-message] [--push]

# Default commit message
COMMIT_MSG="${1:-Auto-save: $(date '+%Y-%m-%d %H:%M:%S')}"
PUSH_CHANGES=false

# Check if --push flag is provided
if [[ "$*" == *"--push"* ]]; then
    PUSH_CHANGES=true
fi

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Saving changes across all projects...${NC}\n"

# Find all Git repositories in common locations
PROJECT_DIRS=(
    "$HOME/Projects"
    "$HOME/CreatorFlow"
    "$HOME/Documents/Projects"
    "$HOME/Code"
)

# Collect all Git repositories
REPOS=()
for dir in "${PROJECT_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        while IFS= read -r -d '' repo; do
            repo_path="${repo%/.git}"
            REPOS+=("$repo_path")
        done < <(find "$dir" -maxdepth 3 -type d -name ".git" -print0 2>/dev/null)
    fi
done

# If no repos found, try current directory
if [ ${#REPOS[@]} -eq 0 ]; then
    if [ -d ".git" ]; then
        REPOS=("$(pwd)")
    fi
fi

if [ ${#REPOS[@]} -eq 0 ]; then
    echo -e "${RED}❌ No Git repositories found.${NC}"
    exit 1
fi

echo -e "Found ${#REPOS[@]} project(s):\n"

SUCCESS_COUNT=0
SKIP_COUNT=0
ERROR_COUNT=0

# Process each repository
for repo in "${REPOS[@]}"; do
    repo_name=$(basename "$repo")
    echo -e "${YELLOW}📁 Processing: $repo_name${NC}"
    echo "   Path: $repo"
    
    cd "$repo" || continue
    
    # Check if there are any changes
    if ! git diff-index --quiet HEAD -- 2>/dev/null && [ -n "$(git status --porcelain)" ]; then
        echo -e "   ${YELLOW}⚠️  Uncommitted changes found${NC}"
        
        # Add all changes
        git add -A
        
        # Commit changes
        if git commit -m "$COMMIT_MSG" > /dev/null 2>&1; then
            echo -e "   ${GREEN}✅ Committed changes${NC}"
            
            # Push if requested
            if [ "$PUSH_CHANGES" = true ]; then
                if git push > /dev/null 2>&1; then
                    echo -e "   ${GREEN}✅ Pushed to remote${NC}"
                    ((SUCCESS_COUNT++))
                else
                    echo -e "   ${RED}❌ Failed to push${NC}"
                    ((ERROR_COUNT++))
                fi
            else
                ((SUCCESS_COUNT++))
            fi
        else
            echo -e "   ${RED}❌ Failed to commit${NC}"
            ((ERROR_COUNT++))
        fi
    else
        echo -e "   ${GREEN}✓ No changes to commit${NC}"
        ((SKIP_COUNT++))
    fi
    
    echo ""
done

# Summary
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}Summary:${NC}"
echo -e "  ✅ Saved: $SUCCESS_COUNT project(s)"
echo -e "  ⏭️  Skipped: $SKIP_COUNT project(s)"
echo -e "  ❌ Errors: $ERROR_COUNT project(s)"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

