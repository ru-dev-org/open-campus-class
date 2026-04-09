#!/bin/bash
# students/*.js を探して、basenameを取得して配列形式で書き出す
FILES=$(ls students/*.js 2>/dev/null | xargs -n 1 basename)

echo "// 自動生成されたファイルです。手動で編集しないでください。" > student_list.js
echo "const studentFiles = [" >> student_list.js

for f in $FILES; do
    echo "  '$f'," >> student_list.js
done

echo "];" >> student_list.js
echo "Updated student_list.js with $FILES"
