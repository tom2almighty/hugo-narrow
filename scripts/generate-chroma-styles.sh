#!/bin/bash

# Hugo Chroma 样式生成脚本
# 用法: ./scripts/generate-chroma-styles.sh [style-name]
# 示例: ./scripts/generate-chroma-styles.sh monokai

STYLE_NAME=${1:-"github"}
OUTPUT_FILE="assets/css/syntax-highlighting.css"

echo "🎨 生成 Chroma 语法高亮样式..."
echo "样式: $STYLE_NAME"
echo "输出: $OUTPUT_FILE"

# 检查 Hugo 是否可用
if ! command -v hugo &> /dev/null; then
    echo "❌ 错误: Hugo 未安装或不在 PATH 中"
    exit 1
fi

# 创建临时文件
TEMP_LIGHT=$(mktemp)
TEMP_DARK=$(mktemp)

# 生成亮色模式样式
echo "📝 生成亮色模式样式..."
if [ "$STYLE_NAME" = "github" ]; then
    hugo gen chromastyles --style=github > "$TEMP_LIGHT"
else
    hugo gen chromastyles --style="$STYLE_NAME" > "$TEMP_LIGHT"
fi

# 生成暗色模式样式
echo "🌙 生成暗色模式样式..."
if [ "$STYLE_NAME" = "github" ]; then
    hugo gen chromastyles --style=github-dark > "$TEMP_DARK"
else
    # 对于非 GitHub 样式，尝试找到对应的暗色版本
    case "$STYLE_NAME" in
        "monokai")
            hugo gen chromastyles --style=monokai > "$TEMP_DARK"
            ;;
        "dracula")
            hugo gen chromastyles --style=dracula > "$TEMP_DARK"
            ;;
        "vs")
            hugo gen chromastyles --style=vs-dark > "$TEMP_DARK"
            ;;
        *)
            echo "⚠️  警告: 没有找到 $STYLE_NAME 的暗色版本，使用相同样式"
            hugo gen chromastyles --style="$STYLE_NAME" > "$TEMP_DARK"
            ;;
    esac
fi

# 创建最终的 CSS 文件
cat > "$OUTPUT_FILE" << EOF
/* 语法高亮样式 - 基于 Hugo Chroma 生成 */
/* 样式: $STYLE_NAME */
/* 生成时间: $(date) */

/* 亮色模式语法高亮 */
:root:not(.dark) {
EOF

# 处理亮色模式样式，转换为 CSS 变量
echo "🔄 处理亮色模式样式..."
sed -n '/\.chroma/,/^$/p' "$TEMP_LIGHT" | \
sed 's/\.chroma \([^{]*\) { color: \([^;]*\);.*/  --chroma-\1: \2;/g' | \
sed 's/\.chroma \([^{]*\) { background-color: \([^;]*\);.*/  --chroma-\1-bg: \2;/g' | \
grep -E '^  --chroma-' | \
head -20 >> "$OUTPUT_FILE"

cat >> "$OUTPUT_FILE" << EOF
}

/* 暗色模式语法高亮 */
.dark {
EOF

# 处理暗色模式样式，转换为 CSS 变量
echo "🔄 处理暗色模式样式..."
sed -n '/\.chroma/,/^$/p' "$TEMP_DARK" | \
sed 's/\.chroma \([^{]*\) { color: \([^;]*\);.*/  --chroma-\1: \2;/g' | \
sed 's/\.chroma \([^{]*\) { background-color: \([^;]*\);.*/  --chroma-\1-bg: \2;/g' | \
grep -E '^  --chroma-' | \
head -20 >> "$OUTPUT_FILE"

cat >> "$OUTPUT_FILE" << EOF
}

/* Chroma 样式应用 */
.chroma { 
  background-color: transparent;
  color: inherit;
}

/* 基础样式 */
.chroma .err { color: var(--chroma-err, #f85149); }
.chroma .lnlinks { outline: none; text-decoration: none; color: inherit; }
.chroma .lntd { vertical-align: top; padding: 0; margin: 0; border: 0; }
.chroma .lntable { border-spacing: 0; padding: 0; margin: 0; border: 0; }
.chroma .hl { background-color: var(--chroma-hl, #e5e5e5); }
.chroma .lnt, .chroma .ln { 
  white-space: pre; 
  user-select: none; 
  margin-right: 0.4em; 
  padding: 0 0.4em 0 0.4em; 
  color: var(--chroma-ln, #7f7f7f); 
}
.chroma .line { display: flex; }

/* 关键字 */
.chroma .k, .chroma .kc, .chroma .kd, .chroma .kn, .chroma .kr, .chroma .kt { 
  color: var(--chroma-k, #cf222e); 
}
.chroma .kp { color: var(--chroma-kp, var(--chroma-k)); }

/* 名称 */
.chroma .n { color: var(--chroma-n, inherit); }
.chroma .na { color: var(--chroma-na, var(--chroma-n)); }
.chroma .nc { color: var(--chroma-nc, var(--chroma-n)); font-weight: bold; }
.chroma .no { color: var(--chroma-no, var(--chroma-n)); font-weight: bold; }
.chroma .nd { color: var(--chroma-nd, var(--chroma-n)); font-weight: bold; }
.chroma .ni { color: var(--chroma-ni, var(--chroma-n)); }
.chroma .ne { color: var(--chroma-ne, var(--chroma-n)); font-weight: bold; }
.chroma .nl { color: var(--chroma-nl, var(--chroma-n)); font-weight: bold; }
.chroma .nn { color: var(--chroma-nn, var(--chroma-n)); }
.chroma .nx { color: var(--chroma-nx, var(--chroma-n)); }
.chroma .py { color: var(--chroma-py, var(--chroma-n)); }
.chroma .nt { color: var(--chroma-nt, var(--chroma-n)); }
.chroma .nb { color: var(--chroma-nb, var(--chroma-n)); }
.chroma .bp { color: var(--chroma-bp, var(--chroma-n)); }
.chroma .nv, .chroma .vc, .chroma .vg, .chroma .vi, .chroma .vm { 
  color: var(--chroma-nv, var(--chroma-n)); 
}
.chroma .nf, .chroma .fm { 
  color: var(--chroma-nf, var(--chroma-n)); 
  font-weight: bold; 
}

/* 字面量 */
.chroma .l { color: var(--chroma-l, inherit); }
.chroma .ld { color: var(--chroma-ld, var(--chroma-l)); }
.chroma .s, .chroma .sb, .chroma .sc, .chroma .sd, .chroma .s2, .chroma .si, .chroma .sx, .chroma .s1 { 
  color: var(--chroma-s, #0a3069); 
}
.chroma .sa, .chroma .dl, .chroma .se, .chroma .sh, .chroma .sr { 
  color: var(--chroma-sa, var(--chroma-s)); 
}
.chroma .ss { color: var(--chroma-ss, var(--chroma-s)); }
.chroma .m, .chroma .mb, .chroma .mf, .chroma .mh, .chroma .mi, .chroma .il, .chroma .mo { 
  color: var(--chroma-m, #0550ae); 
}

/* 操作符 */
.chroma .o, .chroma .ow { color: var(--chroma-o, #0550ae); font-weight: bold; }

/* 标点 */
.chroma .p { color: var(--chroma-p, inherit); }

/* 注释 */
.chroma .c, .chroma .ch, .chroma .cm, .chroma .c1 { 
  color: var(--chroma-c, #57606a); 
  font-style: italic; 
}
.chroma .cs, .chroma .cp, .chroma .cpf { 
  color: var(--chroma-cs, var(--chroma-c)); 
  font-weight: bold; 
  font-style: italic; 
}

/* 通用 */
.chroma .gd { 
  color: var(--chroma-gd, #82071e); 
  background-color: var(--chroma-gd-bg, transparent); 
}
.chroma .ge { font-style: italic; }
.chroma .gr { color: var(--chroma-gd); }
.chroma .gh { color: var(--chroma-gh, inherit); font-weight: bold; }
.chroma .gi { 
  color: var(--chroma-gi, #116329); 
  background-color: var(--chroma-gi-bg, transparent); 
}
.chroma .go { color: var(--chroma-go, inherit); }
.chroma .gp { color: var(--chroma-gp, inherit); }
.chroma .gs { font-weight: bold; }
.chroma .gu { color: var(--chroma-gu, inherit); }
.chroma .gt { color: var(--chroma-gt, inherit); }
.chroma .gl { text-decoration: underline; }
.chroma .w { color: var(--chroma-w, inherit); }
EOF

# 清理临时文件
rm -f "$TEMP_LIGHT" "$TEMP_DARK"

echo "✅ 样式生成完成！"
echo "📁 文件位置: $OUTPUT_FILE"
echo ""
echo "🔧 使用说明:"
echo "1. 样式已自动应用到网站"
echo "2. 支持亮色/暗色模式自动切换"
echo "3. 如需使用其他样式，运行:"
echo "   ./scripts/generate-chroma-styles.sh monokai"
echo "   ./scripts/generate-chroma-styles.sh dracula"
echo "   ./scripts/generate-chroma-styles.sh vs"
echo ""
echo "📚 可用样式列表:"
echo "   hugo gen chromastyles --help"
