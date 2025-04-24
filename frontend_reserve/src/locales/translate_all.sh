#!/bin/bash

LANGUAGES=(
  tr ar de es fa fr hi id it ja ko pt-BR ru uk vi zh-CN
)

for lang in "${LANGUAGES[@]}"
do
  echo "Translating: $lang"
  python translate_all.py "$lang"
  echo "-----------------------------"
done