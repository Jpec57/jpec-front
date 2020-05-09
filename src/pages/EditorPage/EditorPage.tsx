import React, {useCallback, useEffect, useRef, useState} from 'react';
import './EditorPage.scss';
import MdEditor from 'react-markdown-editor-lite'
import MarkdownIt from 'markdown-it';
import 'react-markdown-editor-lite/lib/index.css';
import {makePostRequest} from "../../utils/rest";

type Lesson = {
    title: String,
    description: String | null,
    banniere: String | null,
    videoUrl: String | null,
    content: String
};

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

    const [isSent, setIsSent] = useState(false);
    const [code, setCode] = React.useState(text);
    const [title, setTitle] = React.useState('This is a title');
    const [description, setDescription] = React.useState('This is a small description on a lesson that does not exist yet. But believe me, when it will, it will be awesome. You have my word.');
    const [banniereUrl, setBanniereUrl] = React.useState('');
    const [videoUrl, setVideoUrl] = React.useState('https://www.youtube.com/watch?v=An6sKwhUH48');


    const handleEditorChange = ({html, text}: { html: any, text: any }) => {
        setCode(text);
    };

    const checkForm = (lesson: Lesson): boolean => {
        const {title, content} = lesson;
        if (title.length < 3) {
            return false;
        }
        return content.length >= 3;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const lesson: Lesson = {
            title: title,
            description: description,
            content: code,
            banniere: banniereUrl,
            videoUrl: videoUrl
        };

        const isFormValid = checkForm(lesson);
        if (isFormValid) {
            makePostRequest("/lessons", lesson).then((res: any) => {
                console.log(res);
                setIsSent(true);
            });
        }
    };


    const renderForm = () => {
        return (<form onSubmit={handleSubmit}>

                <div className="flex-vertical">
                    <div className="flex-vertical mb-20">

                    <span>Title</span>
                    <input value={title} onChange={(e) => setTitle(e.target.value)}/>

                    <span>Description</span>
                    <input value={description} onChange={(e) => setDescription(e.target.value)}/>

                    <span>Cover image (optionnal)</span>
                    <input value={banniereUrl} onChange={(e) => setBanniereUrl(e.target.value)}/>

                    <span>Header video (optionnal)</span>
                    <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)}/>
                    </div>

                    <div className="flex-horizontal">
                        <MdEditor
                            markdownClass="md-editor"
                            value={code}
                            renderHTML={(text) => mdParser.render(text)}
                            onChange={handleEditorChange}
                        />
                    </div>
                </div>
                <button id="editor-send-button">
                    SEND
                </button>
            </form>
        );
    };


    return (
        <div className="container">
            {isSent ? <span>GG</span> : renderForm()}
        </div>
    );
};

export default EditorPage;