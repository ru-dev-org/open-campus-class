// studentFiles 配列（student_list.jsで定義）をもとに、すべてのAIスクリプトを読み込む
if (typeof studentFiles !== 'undefined') {
    studentFiles.forEach(file => {
        // 同期的に読み込むために document.write を使用（ページロード中に実行されることが前提）
        document.write(`<script src="students/${file}"></script>`);
    });
} else {
    console.warn("studentFiles is not defined. Run update_ais.sh to generate it.");
}
