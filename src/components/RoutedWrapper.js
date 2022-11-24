import { resetTest } from "../actions/resetTest";
import { useDispatch, useSelector } from "react-redux";
import { setRef, setCaretRef } from "../store/actions";
import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { faArrowLeft, faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { timerSet } from "../store/actions";

export default function RoutedWrapper() {
    const {
        preferences: { level },
        word: { typedWord, currWord, wordList, typedHistory },
        time: { timer, timerId }
    } = useSelector((state) => state);
    const dispatch = useDispatch();
    const extraLetters = typedWord.slice(currWord.length).split("");
    const activeWord = useRef(null);
    const caretRef = useRef(null);

	useEffect(() => {
        dispatch(setRef(activeWord));
        dispatch(setCaretRef(caretRef));
    }, [dispatch]);

    useEffect(() => {
        if (typedWord === wordList[wordList.length - 1]) {
            dispatch(timerSet(0));
        }
    });

    const handleResetClick = () => {
        if (timer) {
            resetTest();
        }
    }

	return (
		<div className="test">
            <div className="timer">{timer}</div>
            <div className="wrapper">
                {wordList.slice(0, 501).map((word, idx) => {
                    const isActive =
                        currWord === word && typedHistory.length === idx;
                    return (
                        <div
                            key={word + idx}
                            className="word"
                            ref={isActive ? activeWord : null}>
                            {isActive ? (
                                <span
                                    ref={caretRef}
                                    id="caret"
                                    className="blink"
                                    style={{
                                        left: typedWord.length * 14.5833,
                                    }}>
                                    |
                                </span>
                            ) : null}
                            {word.split("").map((char, charId) => {
                                return <span key={char + charId}>{char}</span>;
                            })}
                            {isActive
                                ? extraLetters.map((char, charId) => {
                                      return (
                                          <span
                                              key={char + charId}
                                              className="wrong extra">
                                              {char}
                                          </span>
                                      );
                                  })
                                : typedHistory[idx]
                                ? typedHistory[idx]
                                      .slice(wordList[idx].length)
                                      .split("")
                                      .map((char, charId) => {
                                          return (
                                              <span
                                                  key={char + charId}
                                                  className="wrong extra">
                                                  {char}
                                              </span>
                                          );
                                      })
                                : null}
                        </div>
                    );
                })}
            </div>
			<div className={timerId ? "hidden advice" : "advice"}>
				Нажмите <div className="advice__button">Ctrl</div> + <div className="advice__button">E</div> , чтобы открыть панель управления.
			</div>
            {timerId ? 
                <button className="reset_btn" onClick={handleResetClick}>
                    <FontAwesomeIcon icon={faArrowRotateLeft} />
                </button> 
                : 
                <Link className="exit_btn" to="..">
                    <FontAwesomeIcon icon={faArrowLeft} />
                </Link>
            }
        </div>
	);
}