#!/bin/bash

# Print total number of projects
total_projects=$(wc -l < projects.txt)
echo "🔍 Found $total_projects projects to delete"
echo "⚠️  WARNING: This will delete all projects listed in projects.txt"
echo "⚠️  Press Ctrl+C to cancel or Enter to continue..."
read

# Counter for progress
current=0

while IFS= read -r line; do
  project_name=$(echo "$line" | xargs)

  if [ -n "$project_name" ]; then
    ((current++))
    echo ""
    echo "🔥 Deleting ($current/$total_projects): $project_name"
    deployctl projects delete "$project_name" --force
    
    # Optional: Add a small delay to prevent rate limiting
    sleep 1
  fi
done < projects.txt

echo ""
echo "✅ Deletion complete! All $total_projects projects have been deleted."
