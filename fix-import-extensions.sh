#!/bin/bash

echo "🔧 Fixing .js import/export extensions to .ts in src/..."

find ./src -type f -name "*.ts" | while read file; do
  sed -i '' -E "s/from ['\"](.*)\.js['\"]/from '\1.ts'/g" "$file"
  sed -i '' -E "s/import\((['\"])(.*)\.js(['\"])\)/import(\1\2.ts\3)/g" "$file"
done

echo "✅ All .js imports changed to .ts"
