import { atom } from "recoil";

const localStorageEffect = key => ({setSelf, onSet}) => {
    const savedValue = localStorage.getItem(key)
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }
  
    onSet((newValue, _, isReset) => {
      isReset
        ? localStorage.removeItem(key)
        : localStorage.setItem(key, JSON.stringify(newValue));
    });
  };



export const myJobQuestionAtom = atom({
    key: "myJobQuestionAtom",
    default: "",
    effects: [
        localStorageEffect("myJobQuestionAtom")
    ]
});

export const myJobQuestionIdAtom = atom({
    key: "myJobQuestionIdAtom",
    default: 0,
    effects: [
        localStorageEffect("myJobQuestionIdAtom")
    ]
});

export const myJobAtom = atom({
    key: "myJobAtom",
    default: {
        myPart:"",
        myJob: ""
    },
});

export const myAnalyzeAtom = atom({
    key: "myAnalyzeAtom",
    default: {
        created_at: "",
        id: 0,
        overall_feedback: "",
        question_list_id: 0,
        responses: []
    },
});


