#!/bin/bash

# Create proxy.txt file or clear it if it exists
> proxy.txt

# Counter for progress
total=50

for i in $(seq 1 $total); do
  project_name="render-proxy-$i"
  echo ""
  echo "🚀 Creating and deploying project ($i/$total): $project_name"
  
  # Create the project first
  echo "Creating project: $project_name"
  deployctl projects create "$project_name"
  
  if [ $? -eq 0 ]; then
    # Deploy the code with explicit entrypoint
    echo "Deploying to: $project_name"
    deployctl deploy --project="$project_name" --prod ./app.js
    
    if [ $? -eq 0 ]; then
      # Save the URL
      project_url="https://$project_name.deno.dev"
      echo "$project_url" >> proxy.txt
      echo "✅ Created and deployed: $project_url"
    else
      echo "❌ Failed to deploy: $project_name"
      echo "# Failed to deploy: $project_name" >> proxy.txt
    fi
  else
    echo "❌ Failed to create project: $project_name"
    echo "# Failed to create: $project_name" >> proxy.txt
  fi
  
  # Add a small delay to prevent rate limiting
  sleep 2
done

echo ""
echo "✅ Process complete! Created and deployed projects, saved URLs to proxy.txt"
echo "📝 You can find all URLs in proxy.txt" 
