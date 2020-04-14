import React, { useRef, MutableRefObject, useState, useEffect } from "react";
import "./JapanesePage.scss";
import "../../japanese-translations/test_jap.srt";
const text = `
1
00:00:02,168 --> 00:00:04,170
（ナレーション）
富 名声 力

2
00:00:04,295 --> 00:00:08,383
この世のすべてを手に入れた男
海賊王 ゴールド･ロジャー

3
00:00:08,508 --> 00:00:12,137
彼の死に際に放ったひと言は
人々を海へ駆り立てた

4
00:00:12,303 --> 00:00:15,932
（ゴールド･ロジャー）
俺の財宝か？
欲しけりゃくれてやる

5
00:00:16,099 --> 00:00:19,644
探せ！ この世のすべてを
そこに置いてきた

6
00:00:22,272 --> 00:00:24,774
（ナレーション）
男たちは
グランドラインを目指し

7
00:00:24,899 --> 00:00:26,651
夢を追い続ける

8
00:00:27,027 --> 00:00:30,280
世は まさに大海賊時代！

9
00:00:30,989 --> 00:00:36,995
♪～

10
00:01:43,978 --> 00:01:50,485
～♪

11
00:01:50,902 --> 00:01:57,909
`;
type SpeechConfig = {
  pitch: number; //between 0 and 2
  rate: number; // between 0 and 1
  text: string;
  voice: SpeechSynthesisVoice | null;
  volume: number; // between 0 and 1
};

//https://www3.nhk.or.jp/news/easy/
const JapanesePage: React.FC = () => {
  const [dialog, setDialog] = useState("");
  const [dialogLines, setDialogLines] = useState([""]);
  const [isPlaying, setIsPlaying] = useState(false);
  var speechSynthesisVar: MutableRefObject<SpeechSynthesisUtterance | null> = useRef(
    null
  );

  // fetch("https://jpec-website.herokuapp.com/test")
  //   .then(response => {
  //     return response.json();
  //   })
  //   .then(data => {
  //     console.log(data);
  //   });
  useEffect(() => {
    const splitSrtFile = () => {
      const tmpDialogLines: Array<string> = [];
      const frames = text.trim().split("\n\n");
      frames.forEach(frame => {
        const lines = frame.split("\n");
        const realDialog = lines.slice(2).join("\n");
        console.log(realDialog);
        tmpDialogLines.push(realDialog);
      });
      setDialog(tmpDialogLines.join("\n"));
      setDialogLines(tmpDialogLines);
    };
    splitSrtFile();
  }, []);

  useEffect(() => {
    speechSynthesisVar.current = configureSpeechSynthesis({});
  }, []);

  const configureSpeechSynthesis = ({
    rate = 1
  }: {
    rate?: number;
  }): SpeechSynthesisUtterance => {
    const msg = new SpeechSynthesisUtterance();
    const availableVoices: SpeechSynthesisVoice[] = window.speechSynthesis
      .getVoices()
      .filter(voice => voice.lang === "ja-JP");
    msg.voice = availableVoices[0];
    msg.rate = rate;
    msg.onend = event => {
      setIsPlaying(false);
    };
    msg.onstart = event => {
      setIsPlaying(true);
    };
    return msg;
  };

  const say = (message: string, { rate = 1 }: { rate: number }) => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      return;
    }
    speechSynthesisVar.current = configureSpeechSynthesis({ rate });
    speechSynthesisVar.current.text = message;
    window.speechSynthesis.speak(speechSynthesisVar.current);
  };

  return (
    <div className="container">
      <header className="header-content"></header>
      <div className="page">
        <div className="audio-player">
          <div className="audio-controller-box">
            <div className="audio-controller centered-div">
              <i
                className={
                  `icon solid ` +
                  (isPlaying ? "fa-stop-circle" : "fa-play-circle")
                }
                onClick={() => {
                  say(dialog, { rate: 1 });
                }}
              />
            </div>
          </div>
          <div className="answer-box">
            <div className="text-box">
              {dialogLines.map((line, index) => {
                return (
                  <span key={index}>
                    {line.trim()}
                    <br></br>
                  </span>
                );
              })}
            </div>
          </div>
          <button
            onClick={() => {
              console.log("oups");
            }}
          >
            Verify my answers
          </button>
        </div>
      </div>
    </div>
  );
};

export default JapanesePage;
