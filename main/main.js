'use strict';
function printReceipt(tags)
{
//#1. 通过调用loadAllViews()函数获得商品的部分信息inputsArr：[Object],再通过其与tags的barcode联系，
//并计算count，生成最终包含所有购买商品信息的信息comInputs：[Object] (15min)
    var inputsArr=loadAllItems();
    tags.sort();
    var comInputs=[];
    let tempArr = [];
    for(let i = 0; i < tags.length; i++)
    {
     let flag = tags[i].indexOf('-');
     if(flag != -1)
     {
       tempArr.push({barcode:tags[i].split('-')[0], num:tags[i].split('-')[1]});
     }
     else
     {
       tempArr.push({barcode:tags[i], num:1});
     }
    }
    for (let i = 0; i < tempArr.length;)
    {
     let countNum = 0;
     let temp = 0;
     for(let j = 0 ; j < tempArr.length; j++) 
     {
       if(tempArr[i].barcode == tempArr[j].barcode) 
        {
          temp ++;
          countNum += parseFloat(tempArr[j].num);
        }
     }
     comInputs.push({barcode:tempArr[i].barcode,count:countNum});
     i += temp;
    }
    for(let i = 0; i < comInputs.length;i++)
    {
        for(let j = 0; j < inputsArr.length; j++) 
        {
            if (comInputs[i].barcode == inputsArr[j].barcode) 
            {
                comInputs[i].name = inputsArr[j].name;
                comInputs[i].unit = inputsArr[j].unit;
                comInputs[i].price = inputsArr[j].price;
            }
        }
    }
    var com_Inputs=comInputs;//(实际20min)
//#2.计算出每个折扣商品的折扣数量，price为单价
//  （通过调用loadPromotions()函数获得折扣的商品信息saleInputs:[Object]）(15min)
//#3.计算小计(10min)
    var saleInputs=loadPromotions();
    var sale_Inputs=saleInputs[0].barcodes;
    var saleCount=[];
    var p=0;
    var perSum=[];
   
       for(var i=0;i<com_Inputs.length;i++)
       {
         var flag1=0;
         for(var j=0;j<sale_Inputs.length;j++)
         {
              if(com_Inputs[i].count>=2 && sale_Inputs[j]==com_Inputs[i].barcode)
              {
                saleCount[p]=com_Inputs[i].price;
                p++;
                perSum[i]=(com_Inputs[i].count-1)*com_Inputs[i].price; 
                flag1=1;
              }
              
         } 
          if(flag1==0)
           perSum[i]=com_Inputs[i].count*com_Inputs[i].price;   
         
       }//(实际14min)

//#4.计算总金额(5min)
  function tol_Sum(perSum)
  {
    var tolSum=0;
    for(var i=0;i<perSum.length;i++)
    { 
      tolSum+=perSum[i];
    }
    return tolSum;
  }//（实际1min)

//#5.计算节省金额(5min)

   function sale_Sum(saleCount)
   {
    var saleSum=0;
    for(var i=0;i<saleCount.length;i++)
    { 
      saleSum+=saleCount[i];
    }
    return saleSum;
   }//(实际3min)

//#6.打印
   var str='';
   for(var i=0;i<com_Inputs.length;i++)
   {
     str+='名称：'+com_Inputs[i].name+'，数量：'+com_Inputs[i].count+
        com_Inputs[i].unit+'，单价：'+com_Inputs[i].price.toFixed(2)+'(元)'+'，小计：'+perSum[i].toFixed(2)+'(元)\n';
   }
    console.log('***<没钱赚商店>收据***\n'+str
    +'----------------------\n'+'总计：'+tol_Sum(perSum).toFixed(2)+'(元)\n'+'节省：'+sale_Sum(saleCount).toFixed(2)+'(元)\n'+'**********************');
}