#!/bin/bash

# .env.local 파일 읽기
if [ ! -f .env.local ]; then
    echo ".env.local 파일이 존재하지 않습니다."
    exit 1
fi

# 각 라인을 읽어 Vercel에 환경 변수 추가
while IFS='=' read -r key value
do
    # 빈 줄이나 주석 무시
    if [[ -z "$key" || "$key" == \#* ]]; then
        continue
    fi
    
    # 따옴표 제거
    value=$(echo "$value" | sed -e 's/^"//' -e 's/"$//')
    
    echo "Adding $key to Vercel..."
    vercel env add "$key" production <<< "$value"
done < .env.local

echo "모든 환경 변수가 Vercel에 추가되었습니다."
