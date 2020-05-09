import React, {useCallback, useEffect, useRef, useState} from 'react';
import './EditorPage.scss';
import MdEditor from 'react-markdown-editor-lite'
import MarkdownIt from 'markdown-it';
import 'react-markdown-editor-lite/lib/index.css';


const EditorPage = () => {
    const text = `
    # Markdown Example

## Titles
## Links

[Google's Homepage][Google]

\`\`\`
[inline-style](https://www.google.com)

[reference-style][Google]
\`\`\`

## Images

![Flutter logo](https://cdn3.iconfinder.com/data/icons/one-piece-flat/48/Cartoons__Anime_One_Piece_Artboard_37-512.png)

## Tables

|Syntax                                 |Result                               |
|---------------------------------------|-------------------------------------|
|\`*italic 1*\`                           |*italic 1*                           |
|\`_italic 2_\`                           | _italic 2_                          |
|\`**bold 1**\`                           |**bold 1**                           |
|\`__bold 2__\`                           |__bold 2__                           |
|\`This is a ~~strikethrough~~\`          |This is a ~~strikethrough~~          |
|\`***italic bold 1***\`                  |***italic bold 1***                  |
|\`___italic bold 2___\`                  |___italic bold 2___                  |
|\`***~~italic bold strikethrough 1~~***\`|***~~italic bold strikethrough 1~~***|
|\`~~***italic bold strikethrough 2***~~\`|~~***italic bold strikethrough 2***~~|

    `;

    const mdParser = new MarkdownIt(/* Markdown-it options */);

    const [code, setCode] = React.useState(
        text
    );
    function handleEditorChange({html, text}: {html: any, text:any}) {
        console.log('handleEditorChange', html, text);
        setCode(text);
    }


    return (
        <div className="container">
            <div className="flex-horizontal">

                <MdEditor
                    markdownClass="md-editor"
                    value={code}
                    renderHTML={(text) => mdParser.render(text)}
                    onChange={handleEditorChange}
                />
            </div>

        </div>
    );
};

export default EditorPage;