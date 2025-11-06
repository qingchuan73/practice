const express = require("express");
const cors = require("cors");
const path = require("path");


const pdf_table_extractor = require("pdf-table-extractor");

const app = express();
const port = 3000;
app.use(cors());
app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});


app.get('/api/parsePdf', (req, res) => {
    const radio = []
    const chekBox = []
    const judge = []
    const fillBlank = []
    try {
        pdf_table_extractor("./resource/ziliao_chewu.pdf", (result) => {
            // result.pageTables 是每页表格数组
            result.pageTables.forEach(page => {
                page.tables.forEach(table => {
                    if (table[1] == '单选题') {
                        radio.push(table)
                    } else if (table[1] == '多选题') {
                        chekBox.push(table)
                    } else if (table[1] == '判断题') {
                        judge.push(table)
                    } else if (table[1] == '填空题') {
                        fillBlank.push(table)
                    }
                });
            });
            res.json({
                radio,
                chekBox,
                judge,
                fillBlank
            })
        }, (err) => {
            console.error(err);
        });



    } catch (error) {
        console.log(error)
    }


})



process.on("uncaughtException", (err) => {
    console.warn("⚠️ 忽略未捕获异常:", err.message);
});
process.on("unhandledRejection", (reason, p) => {
    console.warn("⚠️ 忽略未处理的 Promise:", reason);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
