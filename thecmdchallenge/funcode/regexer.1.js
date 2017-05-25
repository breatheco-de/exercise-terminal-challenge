
var RegExer = function(appendToElem,dExpression,dContent)
{
    // Parameter & Elements
    var parentElem, 
        regexInputWrapperElem,
        regexInputElem,
        regexInputHighlightElem,
        regexOutputWrapperElem,
        regexOutputTextElem,
        regexOutputHighlightElem,
        regularExpression,
        regularExpressionParser,
        regexOutputReplaceElem,
        regexInputReplaceElem,
        
        regexControllArea,
        regexControllButtonMatch,
        regexControllButtonReplace,
        
        regexGroups = [],
        regexPositionToGroup = [],
        useCSSC = false, //experemental with alpha version of CSSC
        parseError = false,
        mode = "match";
    
    // Methods
    var init = function()
    {
        if(!appendToElem)
        {
            parentElem = document.body;
        }
        else if(typeof appendToElem === 'string')
        {
            parentElem = document.getElementById(appendToElem);
        }
        else
        {
            parentElem = appendToElem;
        } 
        
        //Create Elements
        //Input
        regexInputWrapperElem = document.createElement('div');
        regexInputWrapperElem.setAttribute("id", "regexer_input");
        
        regexInputElem = document.createElement('textarea');
        regexInputElem.setAttribute("id", "regexer_input_input");
        regexInputElem.placeholder = "Type your regex here...";
        if(dExpression && dExpression!='') 
        {
            setDefaultExpression(dExpression);
        }
        else
        {
            //s
            setDefaultExpression("([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})");
        }

        regexInputHighlightElem = document.createElement("pre");
        regexInputHighlightElem.setAttribute("id", "regexer_input_pre");


        //Output
        regexOutputWrapperElem = document.createElement("div");
        regexOutputWrapperElem.setAttribute("id", "regexer_text");

        regexOutputTextElem = document.createElement("textarea");
        regexOutputTextElem.setAttribute("id", "regexer_text_txt");
        if(dContent && dContent!='') 
        {
            setDefaultContent(dContent.replace(/[\r\n]/g, "&#13;&#13;"));
        }
        else setDefaultContent(  
            "This is an example text, this text contains emails, phone numbers and other sample designed for testing purposes. To use this tool, please type a regular expression in the text-area above. &#13;&#13;" +
            "When designing regex for emails make sure you cover all possible email types like: info@breatheco.de, dragon23@gmail.com, dragon_ball@yahoo.com.us and also test for bad email formats like ramond=32@skas.com &#13;&#13;" +
            "When texting for urls you have samples like this: https://thedomain.com.ve/dir1/dir2.html, some urls don't have extensions like this http://www.thedomain.net/directory1, maybe you will find some urls with nested subdomains like http://test.www.thedomain.com.ve/directory1"
            );
        
        regexOutputHighlightElem = document.createElement("pre");
        regexOutputHighlightElem.setAttribute("id", "regexer_text_pre");
        
        /* Controlls */
        regexControllArea = document.createElement("div");
        regexControllArea.setAttribute("id", "regex_controll");
        
        regexControllButtonMatch = document.createElement("a");
        regexControllButtonMatch.setAttribute("id", "regex_controll_match");
        if(mode === "match") regexControllButtonMatch.setAttribute("class", "sel");
        regexControllButtonMatch.innerHTML = "match";
        regexControllArea.appendChild(regexControllButtonMatch);
        
        parentElem.appendChild(regexControllArea);
        /* /Controlls */

        //Append Elements in DOM
        parentElem.appendChild(regexInputWrapperElem);
        regexInputWrapperElem.appendChild(regexInputElem);
        regexInputWrapperElem.appendChild(regexInputHighlightElem);
        
        
        parentElem.appendChild(regexOutputWrapperElem);
        regexOutputWrapperElem.appendChild(regexOutputTextElem);
        regexOutputWrapperElem.appendChild(regexOutputHighlightElem);
        
        setOutputHeight();
        
        manageEvents();

    },
    setDefaultExpression = function(defaultExpression)
    {
        var tempRegex = defaultExpression;
        regexInputElem.innerHTML = tempRegex;
        regexInputElem.value = tempRegex;
    },
    setDefaultContent = function(defaultContent)
    {
        regexOutputTextElem.innerHTML = defaultContent;

    },
    setOutputHeight = function()
    {
        if(useCSSC)
        {
            //CSSC("#"+regexOutputTextElem.getAttribute("id")).set("height", regexOutputHighlightElem.offsetHeight+"px");
        }
        else
        {
            //regexOutputTextElem.style.height = regexOutputHighlightElem.offsetHeight+"px";
        }
    },
    manageEvents = function()
    {
        var keyUpParseControll = function(e)
        {
            var parsed = false;
            
            if
            (!(
                (
                    e.keyCode <= 40 &&
                    (
                        e.keyCode !== 13 && e.keyCode !== 8 &&
                        e.keyCode !== 9 && e.keyCode !== 32
                    )
                )
                ||
                (
                    e.keyCode >= 112 && e.keyCode <= 150
                )
                ||
                e.keyCode === 91
                ||
                e.keyCode === 92
            ))
            {
                parse();
                parsed = true;
            }
            
            highlight();
            
            return parsed;
        };
        
        regexOutputTextElem.addEventListener("scroll", function()
        {
            regexOutputHighlightElem.scrollTop = this.scrollTop;
        });
        
        regexOutputTextElem.addEventListener("change", function()
        {
            regexOutputHighlightElem.innerHTML = '<span>'+encode(this.value)+'</span>\n';  
            
            regexOutputHighlightElem.scrollTop = this.scrollTop;
            
            parse();
            
        });
        regexOutputTextElem.addEventListener("keyup", function(e)
        {
            keyUpParseControll(e);
            
        });
        
        regexInputElem.addEventListener("scroll", function()
        {
            regexInputHighlightElem.scrollTop = this.scrollTop;
        });
        regexInputElem.addEventListener("change", function()
        {
            regexInputHighlightElem.scrollTop = this.scrollTop;
        });
        
        regexInputElem.addEventListener("keyup", function(e)
        {
            regexInputHighlightElem.scrollTop = this.scrollTop;
            
            keyUpParseControll(e);
        });
        
        regexInputElem.addEventListener("click", function(e)
        {
            highlight();
        });
        
        window.addEventListener("resize", function()
        {
            setOutputHeight();
        });
    },
    parse = function(setScrollPosition)
    {
        if(!regexInputElem.value) return;
            
        try
        {
            regularExpression = new RegExp(regexInputElem.value, 'g');
            regularExpressionParser = new RegExpGrpPos(regularExpression, true);
            
            var regMatch = regularExpressionParser.match(regexOutputTextElem.value);
            
            
            var regMatchRow, moduloPosAB;
            
            
            var formString = new formatedString(regexOutputTextElem.value);
            
            
            for(var i = 0; i < regMatch.length; i++)
            {
                regMatchRow = regMatch[i];
                moduloPosAB = (i % 2 ? 'b' : 'a');
                
                formString.addOpt(regMatchRow[0][1], '<span class="f '+moduloPosAB+' n'+i+'">');
                formString.addOpt(regMatchRow[0][1] + regMatchRow[0][0].length, '</span>');
                
                for(var j = 1; j < regMatchRow.length; j++)
                {
                    formString.addOpt(regMatchRow[j][1], '<span class="g '+moduloPosAB+' n'+j+'">');
                    formString.addOpt(regMatchRow[j][1] + regMatchRow[j][0].length, '</span>');
                }
            }
            
            //console.log(formString.getOpts());
            
            regexOutputHighlightElem.innerHTML = '<span>'+(formString.getFormText(true))+'&nbsp;</span>';
            
            if(useCSSC)
            {
                CSSC("textarea#"+regexInputElem.getAttribute("id")).set("border-color", "#ccc");
            }
            else
            {
                regexInputElem.style.borderColor = "#a3ccac";
                regexInputElem.style.backgroundImage = "url('img/valid.png')";
                regexInputElem.style.backgroundPosition = "right 10px bottom 10px";
                regexInputElem.style.backgroundRepeat = "no-repeat";
                regexInputElem.style.backgroundSize = "25px";
            }
            
            
            regexInputHighlightElem.innerHTML = encode(regexInputElem.value)+'&nbsp;';
            
            calcGropPositions();
            
            if(mode === "replace")
            {
                regexOutputReplaceElem.value = regexOutputTextElem.value.replace(regularExpression, regexInputReplaceElem.value);
            }
            
            //prepaire the complete string
            if(useCSSC)
            {
                var formString = new formatedString(regexInputElem.value),
                    tmp = {};
                
                for(var i = 1; i < regexGroups.length; i++)
                { 
                    for(var j = 0; j < regexGroups[i].length; j++)
                    { 
                        if(!!tmp[regexGroups[i][j]])
                        {
                            tmp[regexGroups[i][j]].push(i);
                        }
                        else
                        { 
                            tmp[regexGroups[i][j]] = [i];
                        } 
                    }
                }
                
                for(var i in tmp)
                {
                    for(var j = 0; j < tmp[i].length; j++)
                    {
                        formString.addOpt(i,'<span class="hg_cssc gn'+tmp[i][j]+'">');
                        formString.addOpt(parseInt(i) + 1,'</span>');
                    }
                }
                regexInputHighlightElem.innerHTML = formString.getFormText(true)+'&nbsp;';
            }
            
            
            parseError = false;
        }
        catch(err)
        {
            console.log(err);
            
            if(useCSSC)
            {
                CSSC("textarea#"+regexInputElem.getAttribute("id")).set("border-color", "#f00");
            }
            else
            {
                regexInputElem.style.borderColor = "#f00";
                regexInputElem.style.backgroundImage = "url('img/invalid.png')";
                regexInputElem.style.backgroundPosition = "right bottom";
                regexInputElem.style.backgroundRepeat = "no-repeat";
                regexInputElem.style.backgroundSize = "15%";
            }
            
            parseError = true;
        }
        
        if(setScrollPosition)
            regexOutputHighlightElem.scrollTop = this.scrollTop;
    },
    lastHighlight = null,
    highlight = function()
    {
        if(parseError)
        {
            return;
        }
        
        var cursorPos = regexInputElem.selectionStart;
        
        //console.log(regexGroups.length);
        //console.log(regexPositionToGroup);
        if(useCSSC)
        {
            for(var i = 1; i <= regexGroups.length; i++)
            {
                CSSC(".g.n"+i).set("background-color", "rgba(0, 0, 0, 0)");
                CSSC(".hg_cssc.gn"+i).set("background-color", "transparent");
            }
            
            CSSC(".g.n"+regexPositionToGroup[cursorPos]).set("background-color", "rgba(0, 0, 0, 0.2)");
            CSSC(".hg_cssc.gn"+regexPositionToGroup[cursorPos]).set("background-color", "#ffecb3");
        }
        else
        {
            var HighlightElems = regexOutputHighlightElem.getElementsByClassName("g");

            for(var i = 0; i < HighlightElems.length; i++)
            {
                HighlightElems[i].classList.remove("s");
            }

            if(!regexPositionToGroup[cursorPos])
            {
                if(lastHighlight !== null)
                {
                    regexInputHighlightElem.innerHTML = encode(regexInputElem.value)+'&nbsp;';

                    lastHighlight = null;
                }
                return;
            }

            HighlightElems = regexOutputHighlightElem.getElementsByClassName("g n"+regexPositionToGroup[cursorPos]);

            for(var i = 0; i < HighlightElems.length; i++)
            {
                HighlightElems[i].classList.add("s");
            }
            
            var klammerPos = regexPositionToGroup[cursorPos] > 0 ? regexGroups[regexPositionToGroup[cursorPos]] : null;
        
            if(!!klammerPos && lastHighlight !== klammerPos)
            {
                var formString = new formatedString(regexInputElem.value);
                formString.addOpt(klammerPos[0],'<span class="hg">');
                formString.addOpt(klammerPos[0] + 1,'</span>');
                formString.addOpt(klammerPos[1],'<span class="hg">');
                formString.addOpt(klammerPos[1] + 1,'</span>');


                regexInputHighlightElem.innerHTML = formString.getFormText(true)+'&nbsp;';

                lastHighlight = klammerPos;
            }
            else if(lastHighlight !== klammerPos)
            {
                regexInputHighlightElem.innerHTML = regexInputElem.value+'&nbsp;';

                lastHighlight = klammerPos;   
            }
        }
        
    },
    switchMode = function(m)
    {
        if(m != "match" && m != "replace")
            return;
        
        regexControllButtonMatch.setAttribute("class", "")
        regexControllButtonReplace.setAttribute("class", "")
        
        var modeElem = regexControllButtonReplace;
        
        if(m == "match")
            modeElem = regexControllButtonMatch;
        
        modeElem.classList.add("sel");
        
        regexInputWrapperElem.setAttribute("class", m);
        regexOutputWrapperElem.setAttribute("class", m);
        
        setOutputHeight();
        
        mode = m;
        
        parse();
    },
    calcGropPositions = function()
    {
        var analyseString = regexInputElem.value; 
        
        regexGroups = [[0,analyseString.length]],
        regexPositionToGroup = [0];
        
        var chr, curGrp = 0, toBreak = false, toCount = false;
        for(var i = 0; i < analyseString.length; i++)
        {
            chr = analyseString[i];
            
            if(analyseString[i-1] != "\\")
            {
                toCount = true;
            }
            else if(chr == '(' || chr == ')')
            {
                toCount = false;
                
                for (var j = (i - 2); j >= 0; j--)
                {
                    if (analyseString[j] === "\\")
                        toCount = !toCount;
                    else
                        break;
                }
            }
            
            if(toCount && chr == '(')
            {
                regexGroups.push([i, null]);
                
                curGrp = regexGroups.length - 1; 
            }
            else if(toCount && chr == ')')
            {
                toBreak = false;
                curGrp = 0;
                for(var j = (regexGroups.length - 1); j >= 0; j--)
                {
                    if(regexGroups[j][1] === null)
                    {
                        if(!toBreak)
                        {
                            regexGroups[j][1] = i;
                            toBreak = true;
                        }
                        else
                        {
                            curGrp = j;
                            break;
                        }
                    }
                }
            }
            
            regexPositionToGroup[i+1] = curGrp;
        }
    };
    
    
    
    init();
    
    if((!!regexInputElem && !!regexInputElem.innerHTML) || (!!regexOutputTextElem && !!regexOutputTextElem.innerHTML))
    {
        parse();
    }

};

var RegExpGrpPos = function(regexp, posabsolute)
{
    var myRegExp = regexp,
        matchStr = null,
        grpPosInfo = null,
        posAbsoluete = !!posabsolute;
    
    var groupFinder = function()
    {
        var regex = myRegExp.toString();

        //console.log(regex);
        var groupPos = [],
            grp = [],
            cnt = 0, 
            chr,
            toCount = false;

        for (var i = 0; i < regex.length; i++)
        {
            chr = regex[i];

            if (chr === '(' && regex[i - 1] !== "\\")
            {
                //console.log("Pos +: " + i);
                cnt++;

                groupPos.push([cnt, i]);
                
            }
            else if (chr === ')' && regex[i - 1] !== "\\")
            {
                //console.log("Pos -: " + i);
                cnt--;
            }
            else if ((chr === '(' || chr === ')') && regex[i - 1] === "\\")
            {
                //console.log(char);
                //console.log(regex[i - 1]);

                toCount = false;

                for (var j = i - 2; j > -1; j--)
                {
                    if (regex[j] === "\\")
                        toCount = !toCount;
                    else
                        break;
                }

                if (toCount && chr === '(')
                {
                    cnt++;

                    groupPos.push([cnt, i]);

                    
                    //console.log("Pos/ +: " + i);
                }
                else if (toCount && chr === ')')
                {
                    cnt--;
                    //console.log("Pos/ -: " + i);
                }
            }
        }

        //cnt muss am ende wieder 0 sein, wenn nicht ist bei der berechnung etwas schief gegangen
        return (cnt === 0 ? groupPos : false);
    },
    findPositions = function(matches)
    {
        var m = [], tmpIndex = 0, foundIndex = matches.index, posM1, posM2;

        m[0] = [matches[0], (!!posAbsoluete ? foundIndex : tmpIndex)];

        for (var i = 1; i < matches.length; i++)
        {
            posM1 = (!!grpPosInfo[i - 1]) ? grpPosInfo[i - 1][0] : 0;
            posM2 = (!!grpPosInfo[i - 2]) ? grpPosInfo[i - 2][0] : 0;
            
            if (posM1 > posM2)
            {
                tmpIndex = (!!posAbsoluete ? (m[i - 1][1] - foundIndex) : m[i - 1][1]); 
            }
            else if(posM1 < posM2)
            {
                tmpIndex = (!!posAbsoluete ? ((m[i - 1][1] + m[i - 1][0].length) - foundIndex) : (m[i - 1][1] + m[i - 1][0].length));
            }

            if (!!matches[i])
            {
                tmpIndex = matches[0].indexOf(matches[i], tmpIndex);

                m[i] = [matches[i], (!!posAbsoluete ? (tmpIndex + foundIndex) : tmpIndex)];

                tmpIndex += matches[i].length;
            }
            else
            {
                m[i] = ["", (!!posAbsoluete ? (tmpIndex + foundIndex) : tmpIndex)];
            }
        }
        
        return m;
    };
    
    this.match = function(str)
    {
        matchStr = str;
        grpPosInfo = groupFinder();
        
        //console.log(grpPosInfo);
        var matches, 
            lastIndex = null,
            retrn = [];

        while((matches = myRegExp.exec(str)) !== null && lastIndex !== matches.index)
        {
            retrn.push(findPositions(matches));

            lastIndex = matches.index;
        }
        
        return retrn;
    };
    this.setPositionAbsolute = function(posabsulute)
    {
        posAbsoluete = !!posabsulute;
    };
};

var formatedString = function(string)
{
    var orgString = string;
    var options = {};
    
    var encode = function(txt)
    {
        return txt.replace(/[\x26\x0A\x3c\x3e\x22\x27]/g, function(txt) 
        {
            return "&#" + txt.charCodeAt(0) + ";";
        });
    },
    parse = function(encodeString)
    {
        var lastPos = 0, formString = "";
        for(var pos in options)
        {
            if(!!encodeString)
            {
                formString += encode(orgString.substr(lastPos, (pos - lastPos)));
            }
            else
            {
                formString += orgString.substr(lastPos, (pos - lastPos));
            }
        
            for(var i = 0; i < options[pos].length; i++)
            {
                formString += options[pos][i];
            }
            
            lastPos = pos;
        }
        
        if(!!encodeString)
        {
            formString += encode(orgString.substr(lastPos));
        }
        else
        {
            formString += orgString.substr(lastPos);
        }
        
        return formString;
    };
    
    this.addOpt = function(pos, opt)
    {
        if(!options[pos])
        {
            options[pos] = [];
        }
        
        options[pos].push(opt);
    };
    this.getOpts = function()
    {
        return options;
    };
    this.getOrgText = function()
    {
        return orgString;
    };
    this.getFormText = function(encodeString)
    {
        return parse(encodeString);
    };
};

var encode = function(txt)
{
    return txt.replace(/[\x26\x0A\x3c\x3e\x22\x27]/g, function(txt) 
    {
        return "&#" + txt.charCodeAt(0) + ";";
    });
};
