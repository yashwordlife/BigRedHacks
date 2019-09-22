var tr = require('textrank'); //library for summarizing
 
function summ(str_1){

    
    var textRank = new tr.TextRank(str_1); //str_1 is the string you want summarized
    var summ_str = textRank.summarizedArticle;
    return summ_str
}


s = summ(str_1) //Pass string here

console.log(s)  //Summarized string is output here


