
1. 缓存功能，能够缓存已经解析好的html模版；

2. <% code %>用于执行其中javascript代码。

3. <%= code %>会对code进行html转义； 

4. <%- code %>将不会进行转义；，这一行代码不会执行，像是被注释了一样，然后显示原来的html。也不会影响整个页面的执行

5. 支持自定义标签，比如'<%'可以使用'{{'，'%>'用'}}'代替； 

6. 提供一些辅助函数，用于模版中使用 
     1. first，返回数组的第一个元素； 
     2. last，返回数组的最后一个元素； 
     3. capitalize，返回首字母大写的字符串； 
     4. downcase，返回字符串的小写； 
     5. upcase，返回字符串的大写； 
     6. sort，排序； 
     7. sort_by:'prop'，按照指定的prop属性进行升序排序； 
     8. size，返回长度，即length属性，不一定非是数组才行； 
     9. plus:n，加上n，将转化为Number进行运算； 
     10. minus:n，减去n，将转化为Number进行运算； 
     11. times:n，乘以n，将转化为Number进行运算； 
    12. divided_by:n，除以n，将转化为Number进行运算； 
    13. join:'val'，将数组用'val'最为分隔符，进行合并成一个字符串； 
    14. truncate:n，截取前n个字符，超过长度时，将返回一个副本 
    15. truncate_words:n，取得字符串中的前n个word，word以空格进行分割； 
    16. replace:pattern,substitution，字符串替换，substitution不提供将删除匹配的子串； 
    17. prepend:val，如果操作数为数组，则进行合并；为字符串则添加val在前面； 
    18. append:val，如果操作数为数组，则进行合并；为字符串则添加val在后面； 
    19. map:'prop'，返回对象数组中属性为prop的值组成的数组； 
    20. reverse，翻转数组或字符串； 
    21. get:'prop'，取得属性为'prop'的值； 
    22. json，转化为json格式字符串 

7. 利用<%- include filename %>加载其他页面模版； 