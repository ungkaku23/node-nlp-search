const { ExtractorEnum } = require('@nlpjs/ner');
const XLSX = require('xlsx');
const express = require('express');

var parseUrl = require('body-parser');
const app = express();

const loadXlsx = (path, columnIndex) => {
  const workbook = XLSX.readFile(path);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];

  const columnA = [];

  for (let z in worksheet) {
    if(z.toString()[0] === columnIndex){
      columnA.push(worksheet[z].v);
    }
  }

  return columnA;
}

const fetchMatchedCnt = (data, keyword) => {
  const similar = new ExtractorEnum();

  return data.reduce((sum, cur) => {
    const nlpMatched = similar.getBestSubstringList(cur, keyword);
    const matchedCnt = nlpMatched.filter(o => o.levenshtein === 0).length;
    sum += matchedCnt;
    return sum;
  }, sum = 0);
}

let encodeUrl = parseUrl.urlencoded({ extended: false });

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/form.html');
});

app.post('/', encodeUrl, (req, res) => {
  console.log('Form request:', req.body);
  const { keyword } = req.body;
  const xlsxData = loadXlsx("./test.xls", "A");
  const totalCnt = fetchMatchedCnt(xlsxData, keyword);
  
  res.json({ keyword, totalCnt });
});

app.listen(4000);