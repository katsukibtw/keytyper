import { resetLevel } from "../actions/resetLevel";
import { useDispatch, useSelector } from "react-redux";
import { setRef, setCaretRef } from "../store/actions";
import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { faArrowLeft, faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { timerSet } from "../store/actions";

export default function RoutedWrapper() {
    const {
        levelWord: { typedLevelWord, currLevelWord, levelWordList, typedLevelHistory },
        time: { timer, timerId }
    } = useSelector((state) => state);
    const dispatch = useDispatch();
    const extraLetters = typedLevelWord.slice(currLevelWord.length).split("");
    const activeWord = useRef(null);
    const caretRef = useRef(null);

	useEffect(() => {
        dispatch(setRef(activeWord));
        dispatch(setCaretRef(caretRef));
    }, [dispatch]);

    useEffect(() => {
        if (typedLevelWord === levelWordList[levelWordList.length - 1]) {
            dispatch(timerSet(0));
        }
    });

    const handleResetClick = () => {
        if (timer) {
            resetLevel();
        }
    }

	return (
		<div className="test">
            <div className="timer">{timer}</div>
            <div className="wrapper">
                {levelWordList.slice(0, 501).map((word, idx) => {
                    const isActive =
                        currLevelWord === word && typedLevelHistory.length === idx;
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
                                        left: typedLevelWord.length * 14.5833,
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
                                : typedLevelHistory[idx]
                                ? typedLevelHistory[idx]
                                      .slice(levelWordList[idx].length)
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
