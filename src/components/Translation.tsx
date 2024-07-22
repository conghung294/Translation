import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { FaArrowRightArrowLeft } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { MdClose } from 'react-icons/md';
import { HiOutlineSpeakerWave } from 'react-icons/hi2';

import axios from '../axios/axios';
import useDebounce from '../hooks/useDebounce';

const Translation = () => {
  const [leftText, setLeftText] = useState<string>('');
  const [rightText, setRightText] = useState<string>('');
  const [languages, setLanguages] = useState<object>({});
  const [selectedLanguage1, setSelectedLanguage1] = useState<string>('en');
  const [selectedLanguage2, setSelectedLanguage2] = useState<string>('vi');
  const [loading, setLoading] = useState<boolean>(false);
  const [isShowCloseIcon, setIsShowCloseIcon] = useState<boolean>(false);
  const debounced = useDebounce(leftText, 700);
  const isCancelled = useRef<boolean>(false);
  useEffect(() => {
    fetchDataLanguage();
  }, []);

  useEffect(() => {
    if (!leftText.trim()) {
      return;
    }
    handleTranslate();
  }, [debounced, selectedLanguage1]);

  const fetchDataLanguage = async () => {
    const languages: object = await axios.get(`/lang-support`);
    if (languages) {
      setLanguages(languages);
    } else {
      toast.error('Không lấy được danh sách ngôn ngữ !');
    }
  };

  const handleTranslate = async () => {
    setLoading(true);
    isCancelled.current = false;
    const response: string = await axios.get(
      `/translation?p1=auto&p2=${selectedLanguage1}&p3=${encodeURIComponent(leftText)}`
    );
    if (isCancelled.current) {
      return;
    }
    if (response) {
      setRightText(response);
      setLoading(false);
    } else {
      setLoading(false);
      toast.error('Có lỗi xảy ra khi dịch !');
    }
  };

  const handleLeftTextChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setLeftText(e.target.value);
    if (e.target.value === '') {
      setIsShowCloseIcon(false);
      setRightText('');
    } else {
      setIsShowCloseIcon(true);
    }
  };

  const handleSpeak = async (language: string, value: string) => {
    try {
      if (!leftText.trim()) {
        return;
      }
      let response: Blob = await axios.get(
        `/speak?lang=${language}&word=${encodeURIComponent(value)}`,
        {
          responseType: 'blob',
        }
      );
      const url = window.URL.createObjectURL(response);
      const audio = new Audio(url);
      audio.addEventListener('canplaythrough', () => {
        audio.play();
      });
    } catch (error) {
      toast.error('Có lỗi xảy ra khi phát âm thanh!');
    }
  };

  const handleRightTextChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setRightText(e.target.value);
  };

  const handleChangeLanguage1 = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage2(event.target.value);
  };

  const handleChangeLanguage2 = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage1(event.target.value);
  };

  const handleReverseLanguage = () => {
    setSelectedLanguage1(selectedLanguage2);
    setSelectedLanguage2(selectedLanguage1);
    setLeftText(rightText);
  };

  const handleDeleteText = (): void => {
    setIsShowCloseIcon(false);
    setLeftText('');
    setRightText('');
    setLoading(false);
    isCancelled.current = true;
  };

  return (
    <div className="container">
      <div className="Translation">
        <div className="title">Chuyển đổi ngôn ngữ</div>

        <div className="chooseLanguage">
          <div className="language1">
            <label htmlFor="languages1" className="labelLanguages">
              Dịch từ ngôn ngữ:
            </label>
            <select
              className="languages"
              id="languages1"
              value={selectedLanguage2}
              onChange={handleChangeLanguage1}
            >
              {Object.entries(languages).map(([value, text]) => {
                return (
                  <option value={value} key={value}>
                    {text}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="arrowIcon">
            <FaArrowRightArrowLeft onClick={handleReverseLanguage} />
          </div>

          <div className="language2">
            <label htmlFor="languages2" className="labelLanguages">
              Sang ngôn ngữ:
            </label>
            <select
              className="languages"
              id="languages2"
              value={selectedLanguage1}
              onChange={handleChangeLanguage2}
            >
              {Object.entries(languages).map(([value, text]) => {
                return (
                  <option value={value} key={value}>
                    {text}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="content">
          <div className="left">
            {isShowCloseIcon && <MdClose onClick={handleDeleteText} className="closeIcon" />}
            <textarea
              value={leftText}
              onChange={handleLeftTextChange}
              className="inputText"
              placeholder="Nhập văn bản ở đây"
            />
            <HiOutlineSpeakerWave
              onClick={() => handleSpeak(selectedLanguage1, leftText)}
              className="speakLeft"
            />
          </div>
          <div className="right">
            <textarea
              value={rightText}
              onChange={handleRightTextChange}
              className="outputText"
              disabled
              placeholder="Bản dịch"
            />
            <HiOutlineSpeakerWave
              onClick={() => handleSpeak(selectedLanguage2, rightText)}
              className="speakRight"
            />
            {loading && <AiOutlineLoading3Quarters className="loadingIcon" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Translation;
