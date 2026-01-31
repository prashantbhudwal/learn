#!/bin/bash

# 1. Print Header
printf "\n================ ACTIVE NODE SERVERS ================\n"
printf "% -15s | % -6s | % -15s | % -10s | % -8s | %s\n" "PORT" "PID" "USER" "AGE" "RAM" "PROJECT FOLDER"
printf "%s\n" "---------------------------------------------------------------------------------"

# 2. List Processes
lsof -iTCP -sTCP:LISTEN -n -P | grep node | while read _ pid user _ _ _ _ _ port _; do 
  dir=$(lsof -a -p $pid -d cwd | awk 'NR==2 {print $NF}' | sed "s|$HOME|~|")
  ram=$(ps -p $pid -o rss= | awk '{print int($1/1024) "MB"}')
  age=$(ps -p $pid -o etime= | xargs)
  
  printf "% -15s | % -6s | % -15s | % -10s | % -8s | %s\n" "$port" "$pid" "$user" "$age" "$ram" "$dir"
done
echo ""

# 3. Interactive Kill Prompt
read -p "Enter PID to kill (or Press Enter to exit): " target_pid

# 4. Handle Input
if [[ -n "$target_pid" ]]; then
  # Check if PID is a number
  if ! [[ "$target_pid" =~ ^[0-9]+$ ]]; then
     echo "❌ Error: '$target_pid' is not a valid number."
     exit 1
  fi

  echo "Attempting to kill PID $target_pid..."
  kill "$target_pid"
  
  if [[ $? -eq 0 ]]; then
    echo "✅ Process $target_pid killed successfully."
  else
    echo "❌ Failed to kill process. You might need 'kill -9' or sudo."
  fi
else
  echo "Exiting without changes."
fi
